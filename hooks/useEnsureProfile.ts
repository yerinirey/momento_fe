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
        console.log("[profiles] getUser err:", getUserErr.message);
      if (!user) return;

      // 필요하면 user.user_metadata에서 username 등 초기값도 넣기
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: user.id }, { onConflict: "id" });
      if (error) console.error("[profiles] upsert error:", error);
      else console.log("[profiles] upsert ok");
    } finally {
      inflight.current = false;
    }
  }, []);

  useEffect(() => {
    if (!ranOnce.current) {
      ranOnce.current = true;
      // 앱 시작 시 세션이 이미 있으면 한 번 실행
      ensureProfile();
    }

    // 로그인/토큰갱신/유저정보 변경 시 다시 보장
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
