
export default function home() {

    let contentWrapper = document.querySelector('.jsContentWrapper');

    let projectList = [];

    async function mainHtml() {

        contentWrapper.innerHTML = '';

        let view = await globalFuncObj.fetchView(AppGlobal.baseUrl + 'indexview');

        let doc = new DOMParser().parseFromString(view, 'text/html').querySelector('.jsHomePageContainer');

        contentWrapper.appendChild(doc);

        let projectNameInput = contentWrapper.querySelector('.jsProjectName');

        projectNameInput.addEventListener('keyup', handleSearchInputKeyup);

        projectNameInput.dispatchEvent(new KeyboardEvent("keyup", { key: "" }));

    }

    function handleSearchInputKeyup(e) {

        let filterProjects = projectList.filter(function (project) {

            return project.ProjectName.toLowerCase().indexOf(e.target.value.toLowerCase()) >= 0;

        });

        displayRecord(filterProjects);

    }

    function projectListContainerView() {

        let view = `
                 <a href="${AppGlobal.baseUrl}inventorymap-list" class=" projectlist-tr project-tr1 data-link jsCloneProject">
                        <div class="projectlist-icon">
                            <i>
                                <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24"><path d="M19.5,3h-4.5c-.232,0-.464-.055-.671-.158l-3.156-1.578c-.345-.173-.732-.264-1.118-.264h-2.556C5.019,1,3,3.019,3,5.5V15.5c0,2.481,2.019,4.5,4.5,4.5h12c2.481,0,4.5-2.019,4.5-4.5V7.5c0-2.481-2.019-4.5-4.5-4.5ZM7.5,2h2.556c.231,0,.464,.055,.671,.158l3.155,1.578c.345,.173,.731,.264,1.118,.264h4.5c1.76,0,3.221,1.306,3.464,3H4v-1.5c0-1.93,1.57-3.5,3.5-3.5Zm12,17H7.5c-1.93,0-3.5-1.57-3.5-3.5v-7.5H23v7.5c0,1.93-1.57,3.5-3.5,3.5Zm.5,3.5c0,.276-.224,.5-.5,.5H4.5c-2.481,0-4.5-2.019-4.5-4.5V7.5c0-.276,.224-.5,.5-.5s.5,.224,.5,.5v11c0,1.93,1.57,3.5,3.5,3.5h15c.276,0,.5,.224,.5,.5Z"/></svg>
                            </i>
                        </div>
                        <div class="projectlist-name">
                            <span href="" class="jsProjectName"></span>
                            <div class="project-another-info">
                                <small class="jsUnitTypeName project-category-container"></small>
                                <small class="jsRentOrSaleName project-category-container"></small>
                                <small class="jsIsRFO project-category-container">RFO</small>
                                <small class="jsProjectAddress project-category-container" style="display: none"></small>
                            </div>
                            <div class="project-location-label">
                                <i class="location-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve" fill="#000">
                                        <g id="_01_align_center">
                                            <path d="M255.104,512.171l-14.871-12.747C219.732,482.258,40.725,327.661,40.725,214.577c0-118.398,95.981-214.379,214.379-214.379   s214.379,95.981,214.379,214.379c0,113.085-179.007,267.682-199.423,284.932L255.104,512.171z M255.104,46.553   c-92.753,0.105-167.918,75.27-168.023,168.023c0,71.042,110.132,184.53,168.023,236.473   c57.892-51.964,168.023-165.517,168.023-236.473C423.022,121.823,347.858,46.659,255.104,46.553z"></path>
                                            <path d="M255.104,299.555c-46.932,0-84.978-38.046-84.978-84.978s38.046-84.978,84.978-84.978s84.978,38.046,84.978,84.978   S302.037,299.555,255.104,299.555z M255.104,172.087c-23.466,0-42.489,19.023-42.489,42.489s19.023,42.489,42.489,42.489   s42.489-19.023,42.489-42.489S278.571,172.087,255.104,172.087z"></path>
                                        </g>
                                    </svg>
                                </i>
                                <small></small>
                            </div>
                        </div>
                    <a>`;

        return new DOMParser().parseFromString(view, 'text/html').querySelector('.jsCloneProject');

    }

    function displayRecord(data) {

        let tblContainer = contentWrapper.querySelector('.projectlist-body');

        tblContainer.innerHTML = '';

        //console.log(data);

        if (data && data.length > 0) {

            data.sort(function (a, b) {

                if (a['ProjectName'].toLowerCase() < b['ProjectName'].toLowerCase()) {
                    return -1;
                }
                if (a['ProjectName'].toLowerCase() > b['ProjectName'].toLowerCase()) {
                    return 1;
                }
                return 0;
            });

            data.map((item) => {

                let viewClone = projectListContainerView();

                //console.log(viewClone);

                viewClone.setAttribute('data-id', item.MasterProjectID);
                viewClone.setAttribute('data-name', item.ProjectName);
                viewClone.setAttribute('data-unittypeid', item.UnitTypeID);
                viewClone.querySelector('.jsUnitTypeName').textContent = item.UnitType;
                viewClone.querySelector('.jsProjectName').textContent = item.ProjectName;
                viewClone.setAttribute('data-gmapLink', item.GMapLink);

                //viewClone.querySelector('a').setAttribute('data-id', item.MasterProjectID);
                //viewClone.querySelector('a').setAttribute('data-name', item.ProjectName);

                viewClone.setAttribute('data-rentorsaleid', item.RentOrSaleID);
                viewClone.querySelector('.jsRentOrSaleName').textContent = item.RentOrSale;

                viewClone.setAttribute('data-isrfo', item.IsRFO);

                if (!item.IsRFO) {
                    viewClone.querySelector('.jsIsRFO').setAttribute('style', 'display: none');
                }

                viewClone.querySelector('.jsProjectAddress').textContent = `${item.CityName} (${item.ProvinceName})`;
                viewClone.setAttribute('data-provinceid', item.ProvinceID);
                viewClone.setAttribute('data-cityormuniid', item.CityOrMuniID);
                viewClone.setAttribute('data-provincename', item.ProvinceName);
                viewClone.setAttribute('data-cityname', item.CityName);

                let locationDisplay = "No Location";

                if (item.CityOrMuniID > 0) {
                    locationDisplay = `${item.CityName}, ${item.ProvinceName}`;
                }

                viewClone.querySelector('.project-location-label small').textContent = locationDisplay;

                tblContainer.appendChild(viewClone);
            });
        }
        else {

            let emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-project';
            emptyDiv.setAttribute('style', 'width: 100%; text-align: center; font-size: 14px; padding: 5px;');
            emptyDiv.textContent = 'No project found.'

            tblContainer.appendChild(emptyDiv);

        }
    }

    return {
        init: async function () {

            globalFuncObj.loader.start();

            let { ProjectList } = await globalFuncObj.fetchDataGet(AppGlobal.baseUrl + 'project/get');

            //console.log(ProjectList);

            projectList = ProjectList;

            mainHtml();

            globalFuncObj.loader.stop();

        }
    }

}