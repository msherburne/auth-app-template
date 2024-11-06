import { createAuthClient } from "better-auth/react";
import { adminClient, organizationClient } from "better-auth/client/plugins";

export const clientAuth = createAuthClient({
  plugins: [adminClient(), organizationClient()],
});
