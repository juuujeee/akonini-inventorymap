
import home from "./script_home.js";
import inventoryMapList from "./script_inventorymap_list.js";
import inventoryMapNew from "./script_inventorymap_new.js";
import inventoryMapDetail from "./script_inventorymap_detail.js";

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

        case (baseUrl + 'inventorymap-list'):

            view = inventoryMapList({ ProjectID: params.id, ProjectName: params.name });

            break;

        case (baseUrl + 'inventorymap-upload'):

            view = inventoryMapNew({ ProjectID: params.id, ProjectName: params.name });

            break;


        case (baseUrl + 'inventorymap-detail'):

            view = inventoryMapDetail({ ProjectID: params.id, ProjectName: params.name, InventoryMapUrl: params.url });

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

