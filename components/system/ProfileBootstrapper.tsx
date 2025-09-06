import { useEnsureProfile } from "@/hooks/useEnsureProfile";

export default function ProfileBootstrapper() {
  useEnsureProfile();
  return null;
}
