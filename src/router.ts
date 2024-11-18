import { createWebHistory, createRouter } from "vue-router";

import SignupView from "./views/SignupView.vue";
import LoginView from "./views/LoginView.vue";
import LeaderBoardView from "./views/LeaderBoardView.vue";
import GameView from "./views/GameView.vue";
import DevView from "./views/DevView.vue";
import ProfileView from "./views/ProfileView.vue";
const routes = [
  { path: "/signup", component: SignupView },
  { path: "/login", component: LoginView },
  { path: "/leaderboard", component: LeaderBoardView },
  { path: "/", component: GameView },
  { path: "/game", component: GameView },
  { path: "/profile/:userId?", component: ProfileView },
  { path: "/dev", component: DevView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
