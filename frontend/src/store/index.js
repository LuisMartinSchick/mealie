import Vue from "vue";
import Vuex from "vuex";
import { api } from "@/api";
import createPersistedState from "vuex-persistedstate";
import userSettings from "./modules/userSettings";
import language from "./modules/language";
import siteSettings from "./modules/siteSettings";
import groups from "./modules/groups";

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [
    createPersistedState({
      paths: ["userSettings", "siteSettings"],
    }),
  ],
  modules: {
    userSettings,
    language,
    siteSettings,
    groups,
  },
  state: {
    // All Recipe Data Store
    recentRecipes: [],
    allRecipes: [],
    mealPlanCategories: [],
    allCategories: [],
    allTags: [],
    appInfo: {
      version: "",
      demoStatus: false,
    },
  },

  mutations: {
    setRecentRecipes(state, payload) {
      state.recentRecipes = payload;
    },
    setMealPlanCategories(state, payload) {
      state.mealPlanCategories = payload;
    },
    setAllCategories(state, payload) {
      state.allCategories = payload;
    },
    setAllTags(state, payload) {
      state.allTags = payload;
    },
    setAppInfo(state, payload) {
      state.appInfo = payload;
    },
  },

  actions: {
    async requestRecentRecipes() {
      const payload = await api.recipes.allSummary(0, 30);
      console.log("Recent", payload.length);
      this.commit("setRecentRecipes", payload);
    },
    async requestAllRecipes({ getters }) {
      const payload = await api.recipes.allSummary(31, 9999);
      const recent = getters.getRecentRecipes;
      this.commit("setRecentRecipes", [...recent, ...payload]);
      console.log("All", getters.getRecentRecipes.length);
    },
    async requestCategories({ commit }) {
      const categories = await api.categories.getAll();
      commit("setAllCategories", categories);
    },
    async requestTags({ commit }) {
      const tags = await api.tags.getAll();
      commit("setAllTags", tags);
    },
    async requestAppInfo({ commit }) {
      const response = await api.meta.getAppInfo();
      commit("setAppInfo", response);
    },
  },

  getters: {
    getRecentRecipes: state => state.recentRecipes,
    getMealPlanCategories: state => state.mealPlanCategories,
    getAllCategories: state =>
      state.allCategories.sort((a, b) => (a.slug > b.slug ? 1 : -1)),
    getAllTags: state =>
      state.allTags.sort((a, b) => (a.slug > b.slug ? 1 : -1)),
    getAppInfo: state => state.appInfo,
  },
});

export default store;
export { store };
