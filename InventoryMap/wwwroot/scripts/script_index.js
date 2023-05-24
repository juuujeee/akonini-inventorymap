
import home from "./script_home.js";

const router = function (params = {}) {

    if (params.state) {

        params = { ...params.state };

    }

    let baseUrl = AppGlobal.baseUrl;

    let view = null;

    switch (location.pathname.toLowerCase()) {

        case (baseUrl):
            view = home();
            break;
       
    }

    if (view) {
        view.init();
    }

};

const navigateTo = function (url, params) {


    history.pushState(params, null, url);

    router(params);

}

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", function () {

    document.body.addEventListener("click", function (e) {

        if (e.target.classList.contains("data-link")) {

            let params = { ...e.target.dataset } || {};

            if (!leftMenuContainer.classList.contains("hidden")) {
                leftMenuContainer.classList.add("hidden");
            }

            e.preventDefault();

            navigateTo(e.target.href, params);
        }
    });

    router();

});

