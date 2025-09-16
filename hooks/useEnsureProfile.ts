import { useCallback, useEffect, useRef } from "react";
import { supabase } from "@/supabase";

export function useEnsureProfile() {
  const ranOnce = useRef(false);
  const inflight = useRef(false);

  const ensureProfile = useCallback(async () => {
    if (inflight.current) return;
    inflight.current = true;
    try {
      const {
        data: { user },
        error: getUserErr,
      } = await supabase.auth.getUser();
      if (getUserErr)
        console.error("[profiles] getUser err:", getUserErr.message);
      if (!user) return;

      const { data: existing, error: selErr } = await supabase
        .from("profiles")
        .select("id, username")
        .eq("id", user.id)
        .maybeSingle();
      if (selErr) console.error("[profiles] select err:", selErr?.message);
      if (existing) {
        if (__DEV__) console.log("[profiles] already exists, skip");
        return;
      }

      // 기본 username 생성 (유니크 보장: base + user.id 앞 네글자로 임시 생성)
      // Profile탭에서 직접 수정 가능하게 변경 (추후)
      const raw =
        (user.user_metadata as any)?.username ??
        (user.user_metadata as any)?.user_name ??
        user.email?.split("@")[0] ??
        "user";

      const base =
        raw
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, "")
          .slice(0, 20) || "user";
      const username = `${base}-${user.id.slice(0, 4)}`;

      // 아바타 초기값
      const avatar =
        (user.user_metadata as any)?.avatar_url ??
        (user.user_metadata as any)?.picture ??
        null;

      const { error } = await supabase.from("profiles").upsert(
        { id: user.id, username, avatar_url: avatar },
        { onConflict: "id" } // id 충돌 시 업데이트
      );

      if (error) console.error("[profiles] upsert error:", error);
      else if (__DEV__) console.log("[profiles] upsert ok");
    } finally {
      inflight.current = false;
    }
  }, []);

  useEffect(() => {
    if (!ranOnce.current) {
      ranOnce.current = true;
      // 앱 시작 시 세션이 이미 있으면 보장
      ensureProfile();
    }

    // 로그인/유저갱신/토큰갱신 때 보장
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (
        (event === "SIGNED_IN" ||
          event === "USER_UPDATED" ||
          event === "TOKEN_REFRESHED") &&
        session?.user
      ) {
        await ensureProfile();
      }
    });
    return () => subscription.unsubscribe();
  }, [ensureProfile]);
}
