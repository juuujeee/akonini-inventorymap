
export default function inventoryMapDetail(projectObj) {

    let contentWrapper = document.querySelector('.jsContentWrapper');

    let projectID = projectObj.ProjectID;
    let projectName = projectObj.ProjectName;
    let inventoryMapUrl = projectObj.InventoryMapUrl;
    let title = projectObj.Title;

    let projectLotStatusLL = null;
    let projectLotStatus = [];

    let projectLotRecords = [];

    let projectLotStatusLegend = [];

    let legendAvailableColor = "#3F3F3F";
    let legendReservedColor = "#FFB606";
    let legendSoldColor = "#c71e1e";
    let legendFutureExpansionColor = "#09b52e";

    async function mainHtml() {

        contentWrapper.innerHTML = `
            <div class="home-page-mainContainer jsInventoryMapContainer">
                <div class="page-filter">
                    <i class="jsBack back-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style="height: 20px;"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"></path></svg>
                    </i>
                    <h3 class="page-filter-title jsProjectTitle" style="text-transform: capitalize"></h3>
                </div>
                <div class="home-page-container">

                    <div class="home-page-projectList">
                        <div class="projectList-header" style="grid-template-columns: 1fr">
                            <div class="projectList-header-title" style="justify-content: space-between;">
                                <h3>Inventory Map Detail</h3>
                                <a href="@String.Concat(baseUrl, "inventorymap-upload")" class="upload-svg-new data-link jsUploadNew">Upload</a>
                            </div>
                        </div>

                        <div class="projectlist-body">
               
                        </div>
                    </div>
                </div>

            </div>
        `;

        //let view = await globalFuncObj.fetchView(AppGlobal.baseUrl + `inventorymaplist`);

        //let doc = new DOMParser().parseFromString(view, 'text/html').querySelector('.jsInventoryMapContainer');

        //contentWrapper.appendChild(doc);

        setProjectLotStatusLegend();

        contentWrapper.querySelector('.jsProjectTitle').textContent = projectName;

        contentWrapper.querySelector('.projectlist-body').appendChild(await displayProjectInventoryMap());

        contentWrapper.querySelector('.jsBack').addEventListener('click', handleBackButtonClick);

        contentWrapper.querySelector('.projectList-header-title h3').textContent = 'Inventory Map Detail';

        contentWrapper.querySelector('.jsUploadNew').remove();

        //contentWrapper.querySelector('.jsSvgFileContainer').prepend(generateProjectLotStatusLegend());

        contentWrapper.querySelector('.jsSvgFileContainer').insertBefore(generateProjectLotStatusLegend(), contentWrapper.querySelector('.jsSvgFileContainer').children[1]);

    }

    function setProjectLotStatusLegend() {

        if (projectLotStatusLegend.length > 0) {

            projectLotStatusLegend.forEach((item) => {

                if (item.ProjectLotStatusID == 1) {

                    legendAvailableColor = item.LegendColor;
                }

                else if (item.ProjectLotStatusID == 2) {
                    legendReservedColor = item.LegendColor;
                }

                else if (item.ProjectLotStatusID == 3) {
                    legendSoldColor = item.LegendColor;
                }

                else if (item.ProjectLotStatusID == 4) {
                    legendFutureExpansionColor = item.LegendColor;
                }

            });
        }
    }

    function handleBackButtonClick() {
        history.back();
    }

    async function displayProjectInventoryMap() {

        let view = `
                    <div class="svgFileUploadContainer jsSvgFileContainer" style="height: auto; padding-bottom: 20px">
                        
                        <h4 class="inventorymap-title">${title}</h4>
                        
                    </div>
                `;

        let doc = new DOMParser().parseFromString(view, 'text/html').querySelector('.jsSvgFileContainer');

        let svgEl;

        globalFuncObj.loader.start();

        await fetch(inventoryMapUrl)
            .then(response => response.text())
            .then(svgText => {

                svgEl = new DOMParser().parseFromString(svgText, 'text/html').querySelector('svg');

            })
            .catch(error => {
                console.error("Error fetching SVG file:", error);
            });

        doc.appendChild(svgEl);

        doc.querySelectorAll('[data-lotid]').forEach((item) => {

            let lotID = item.getAttribute('data-lotid');

            let lotDetailObj = projectLotRecords.find(e => e.LotID == lotID);

            // console.log(lotDetailObj);
            item.setAttribute('data-projectlotstatusid', lotDetailObj.ProjectLotStatusID);

            if (item.nextElementSibling) {
                item.nextElementSibling.textContent = lotDetailObj.LotName;
            }

            let legendColor;

            switch (parseInt(lotDetailObj.ProjectLotStatusID)) {

                case 1:
                    //available
                    legendColor = legendAvailableColor;
                    break;


                case 2:
                    //reserved
                    legendColor = legendReservedColor;

                    break;


                case 3:
                    //sold
                    legendColor = legendSoldColor;

                    break;


                case 4:
                    //future expansion
                    legendColor = legendFutureExpansionColor;

                    break;
            }

            item.setAttribute('style', `fill: ${legendColor}`);


            item.parentElement.addEventListener("click", async function () {

                globalFuncObj.loader.start();

                let data = await globalFuncObj.fetchDataGet(`${AppGlobal.baseUrl}inventory-map/projectlotupdateref/${lotID}/${projectID}`);

                globalFuncObj.loader.stop();

                showLotDetail(data.RecordData);
            });

        });


        globalFuncObj.loader.stop();



        return doc;
    }

    function generateProjectLotStatusLegend() {

        let view = `
            <div class="projectLotStatusLegend-wrapper jsProjectLotStatusLegend">
                <div class="projectLotStatusLegend">
                    <h3>Legend</h3>

                    <div class="projectLotStatusLegendContainer jsProjectLotStatusLegendContainer">
                    </div>
                </div>
            </div>
        `;

        let doc = new DOMParser().parseFromString(view, 'text/html').querySelector('.jsProjectLotStatusLegend');


        if (projectLotStatus.length > 0) {

            let tblContainer = doc.querySelector('.jsProjectLotStatusLegendContainer');
            tblContainer.innerHTML = '';

            projectLotStatus.forEach((item) => {

                let el = projectLotStatusLegendItem(item);

                let projectLotStatusLegendObj = projectLotStatusLegend.filter(x => x.ProjectLotStatusID == item.ID);

                if (projectLotStatusLegendObj.length > 0) {
                    el.setAttribute('data-id', projectLotStatusLegendObj[0].ID);
                }

                switch (parseInt(item.ID)) {
                    case 1:

                        el.querySelector('input').value = legendAvailableColor;

                        break;


                    case 2:
                        el.querySelector('input').value = legendReservedColor;

                        break;


                    case 3:

                        el.querySelector('input').value = legendSoldColor;
                        break;


                    case 4:
                        el.querySelector('input').value = legendFutureExpansionColor;

                        break;
                }

                tblContainer.appendChild(el);
            });

        }

        return doc;
    }

    function projectLotStatusLegendItem(data) {

        let view = `
            <div class="projectlotStatusLegend-group jsProjectLotStatusLegendItem" data-projectlotstatusid="${data.ID}">
                <input type="color" class="projectLotStatusLegendInput" value=""/>
                <small>${data.ProjectLotStatusName}</small>
            </div>
        `;

        let doc = new DOMParser().parseFromString(view, 'text/html').querySelector('.jsProjectLotStatusLegendItem');

        doc.querySelector('input').addEventListener('input', function (e) {

            let val = e.target.value;

            if (val) {

                changeProjectLotStatusColor(data.ID, val);
            }

        });

        doc.querySelector('input').addEventListener('change', updateProjectLotStatusLegend);

        return doc;
    }

    async function updateProjectLotStatusLegend(e) {

        let parentEl = e.target.closest('div');

        let val = e.target.value;
        
        if (val) {

            let formData = new FormData();
            formData.append('ID', parentEl.getAttribute('data-id') || 0);
            formData.append('ProjectLotStatusID', parentEl.getAttribute('data-projectlotstatusid'));
            formData.append('LegendColor', val);
            formData.append('MasterProjectID', projectID);

            globalFuncObj.loader.start();

            let data = await globalFuncObj.fetchDataPost(AppGlobal.baseUrl + 'inventory-map/projectlotstatuslegendupdate', formData);

            if (data.HasError) {
                throw alert.databaseError;
            }

            else {
                if (data.StatusCodeNumber == 1) {
                    globalFuncObj.isConfirmedAlertOk(alertType.successAlert, 'Updated successfully.');

                    parentEl.setAttribute('data-id', data.ProjectLotStatusLegendID);
                }

                else {
                    globalFuncObj.isConfirmedAlertOk(alertType.errorAlert, data.ErrorMessage);
                }
            }

            globalFuncObj.loader.stop();
        }

    }

    function changeProjectLotStatusColor(projectlotStatusID, color) {

        document.querySelectorAll('[data-lotid]').forEach((item) => {

            if (item.getAttribute('data-projectlotstatusid') == projectlotStatusID) {

                item.setAttribute('style', `fill: ${color}`);
               
            }

        });
    }

    function showLotDetail(data) {

        let modalContentCss = "width: 95%; margin-left: auto; margin-right: auto; top: 50%; transform: translateY(-50%); left: unset; height: 400px";

        const modalView = `<div class="modal-container jsModal lotDetail-form">
                                    <div class="modal-content" style="${modalContentCss}">
                                        <div class="modal-header">
                                            <h2 class="jsTitleName">Lot Detail</h2>
                                            <span class="close-modal jsCloseModal">✕</span>
                                        </div>
                                        <div class="modal-body">
                                            <input type="hidden" name="LotID" class="jsLotID" value="${data.LotID}"/>
                                            <div class="project-form-group">
                                               <input type="text" class="jsProjectName" placeholder="Project Name" value="${projectName}" required />
                                            </div>
                                            <div class="project-form-group lot-detail-form disabled">
                                               <input type="text" name="LotName" class="jsLotName" placeholder="Lot Name" required disabled value="${data.LotName}"/>
                                               <div class="lot-detail-form-btnContainer jsBtnContainer">
                                                    <button class="lot-detail-form-editBtn jsEditBtn">Edit</button>
                                               </div>
                                            </div>
                                            <div class="project-form-group lot-detail-form disabled">
                                                <div class="dropdown-container hasDropdown">
                                                    <input type="text" name="Status" class="jsStatus dropdown-container-input" placeholder="Status" required disabled data-textcontent="${data.ProjectLotStatusName}" data-id="${data.ProjectLotStatusID}" value="${data.ProjectLotStatusName}">
                                                    <i class="dropdown-container-icon">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path></svg>
                                                    </i>
                                                </div>
                                                <div class="lot-detail-form-btnContainer jsBtnContainer">
                                                    <button class="lot-detail-form-editBtn jsEditBtn">Edit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;

        const modalParse = new DOMParser().parseFromString(modalView, 'text/html').querySelector('.jsModal');

        modalParse.querySelector('.jsCloseModal').addEventListener('click', function (e) {

            this.closest('.jsModal').remove()
        });

        modalParse.querySelectorAll('.jsEditBtn').forEach((item) => {

            editLotDetail(item);

        });

        let statusNameInput = modalParse.querySelector('.jsStatus');

        let config = {
            rawData: projectLotStatusLL,
            dataID: 'ID',
            dataToDisplay: 'ProjectLotStatusName',
            dataDisplayLabel: null
        }

        globalFuncObj.dropdownFunc(statusNameInput, config, function (obj) { });

        document.body.append(modalParse);
    }

    function editLotDetail(el) {

        el.addEventListener('click', function (e) {

            let parentEl = el.closest('.lot-detail-form');
            let btnContainer = parentEl.querySelector('.jsBtnContainer');

            parentEl.querySelector('input').removeAttribute('disabled');
            parentEl.classList.remove('disabled');

            let type = parentEl.querySelector('input').getAttribute('name');

            btnContainer.innerHTML = '';

            let updateDiv = updateBtnDiv();

            btnContainer.appendChild(updateDiv);

            updateLotDetail(updateDiv, type);
        });
    }

    function updateLotDetail(el, type) {

        el.addEventListener('click', function (e) {

            switch (type) {
                case 'LotName':

                    updateLotName(el);
                    break;


                case 'Status':

                    updateLotStatus(el);
                    break;
            }

        })

    }

    async function updateLotName(el) {

        let parentEl = el.closest('.modal-body');
        let btnContainer = el.closest('.lot-detail-form').querySelector('.jsBtnContainer');


        if (parentEl.querySelector('.jsStatus').value) {

            parentEl.querySelector('.jsLotName').removeAttribute('style');

            let formData = new FormData();

            let lotName = parentEl.querySelector('.jsLotName').value;
            let lotID = parentEl.querySelector('.jsLotID').value;

            formData.append('LotID', lotID);
            formData.append('MasterProjectID', projectID);
            formData.append('LotName', lotName);

            let data = await globalFuncObj.fetchDataPost(AppGlobal.baseUrl + 'inventory-map/projectlotnameupdate', formData);

            //console.log(data);

            if (data.HasError) {
                throw alertMessages.databaseError;
            }

            else {
                if (data.StatusCodeNumber == 1) {

                    globalFuncObj.isConfirmedAlertOk(alertType.successAlert, 'Updated Successfully.');

                    parentEl.querySelector('.jsLotName').setAttribute('disabled', 'disabled');
                    el.closest('.lot-detail-form').classList.add('disabled');

                    btnContainer.innerHTML = '';
                    let editDiv = editBtnDiv();

                    btnContainer.appendChild(editDiv);

                    editLotDetail(editDiv);


                    //update the project lot
                    for (var i = 0; i < document.querySelectorAll('[data-lotid]').length; i++) {

                        let item = document.querySelectorAll('[data-lotid]')[i];

                        if (item.getAttribute('data-lotid') == lotID) {

                            if (item.nextElementSibling) {
                                item.nextElementSibling.textContent = lotName;
                            }

                            break;
                        }
                    }
                }
                else if (data.StatusCodeNumber == 0) {
                    globalFuncObj.isConfirmedAlertOk(alertType.successAlert, data.ErrorMessage);

                }
            }
        }
        else {
            parentEl.querySelector('.jsLotName').setAttribute('style', 'border: 1px solid red');
        }

    }

    async function updateLotStatus(el) {

        let parentEl = el.closest('.modal-body');
        let btnContainer = el.closest('.lot-detail-form').querySelector('.jsBtnContainer');

        if (parentEl.querySelector('.jsStatus').getAttribute('data-id') > 0) {

            parentEl.querySelector('.jsStatus').closest('.dropdown-container').removeAttribute('style');

            let formData = new FormData();

            let lotID = parentEl.querySelector('.jsLotID').value;
            let projectLotStatusID = parentEl.querySelector('.jsStatus').getAttribute('data-id');

            formData.append('LotID', lotID);
            formData.append('MasterProjectID', projectID);
            formData.append('ProjectLotStatusID', projectLotStatusID);

            let data = await globalFuncObj.fetchDataPost(AppGlobal.baseUrl + 'inventory-map/projectlotstatusupdate', formData);

            //console.log(data);

            if (data.HasError) {
                throw alertMessages.databaseError;
            }

            else {
                if (data.StatusCodeNumber == 1) {

                    globalFuncObj.isConfirmedAlertOk(alertType.successAlert, 'Updated Successfully.');

                    parentEl.querySelector('.jsStatus').setAttribute('disabled', 'disabled');
                    el.closest('.lot-detail-form').classList.add('disabled');

                    btnContainer.innerHTML = '';

                    let editDiv = editBtnDiv();

                    btnContainer.appendChild(editDiv);

                    editLotDetail(editDiv);


                    //reflect the color coding in inventory map
                    let statusColorCoding = '';

                    if (projectLotStatusID == 2) {
                        statusColorCoding = legendReservedColor;
                    }
                    else if (projectLotStatusID == 3) {
                        statusColorCoding = legendSoldColor;
                    }

                    else if (projectLotStatusID == 4) {
                        statusColorCoding = legendFutureExpansionColor;
                    }

                    for (var i = 0; i < document.querySelectorAll('[data-lotid]').length; i++) {

                        let item = document.querySelectorAll('[data-lotid]')[i];

                        if (item.getAttribute('data-lotid') == lotID) {

                            if (statusColorCoding != '') {
                                item.setAttribute('style', `fill: ${statusColorCoding}`);
                            }

                            else {
                                item.removeAttribute('style');
                            }
                           
                            break;
                        }
                    }
                }
                else if (data.StatusCodeNumber == 0) {
                    globalFuncObj.isConfirmedAlertOk(alertType.successAlert, data.ErrorMessage);

                }
            }
        }
        else {
            parentEl.querySelector('.jsStatus').closest('.dropdown-container').setAttribute('style', 'border: 1px solid red');
        }
    }

    function editBtnDiv() {

        let div = `<button class="lot-detail-form-editBtn jsEditBtn">Edit</button>`;

        let doc = new DOMParser().parseFromString(div, 'text/html').querySelector('.jsEditBtn');

        return doc;
    }

    function updateBtnDiv() {

        let div = `<button class="lot-detail-form-updateBtn jsUpdateBtn">Update</button>`;

        return new DOMParser().parseFromString(div, 'text/html').querySelector('.jsUpdateBtn');
    }


    return {
        init: async function () {

            globalFuncObj.loader.start();

            let { ProjectLotRecords, ProjectLotStatusLegend, ProjectLotStatus } = await globalFuncObj.fetchDataGet(`${AppGlobal.baseUrl}inventory-map/getprojectlots/?masterProjectID=${projectID}`);

            projectLotRecords = ProjectLotRecords;
            projectLotStatusLegend = ProjectLotStatusLegend;
            projectLotStatus = ProjectLotStatus;

            projectLotStatusLL = globalFuncObj.loadDataList(projectLotStatus, 'ID');

            mainHtml();

            globalFuncObj.loader.stop();

            //console.log(projectLotStatusLegend);

        }
    }

}