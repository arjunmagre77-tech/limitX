import React from "react";
import { useRoute, Redirect } from "wouter";

export default function PlayerProfile() {
  const [, params] = useRoute("/player/:username");
  const username = params?.username || "viper";

  // Redirects directly to the rich user profile view which renders esports stats for players
  return <Redirect to={`/profile/${username}`} />;
}
