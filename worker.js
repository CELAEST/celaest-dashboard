export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Redirect legacy/duplicate app.celaest.com -> https://dashboard.celaest.com (301)
    if (
      url.hostname === "app.celaest.com" ||
      (url.hostname === "dashboard.celaest.com" && url.protocol === "http:")
    ) {
      url.protocol = "https:";
      url.hostname = "dashboard.celaest.com";
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
