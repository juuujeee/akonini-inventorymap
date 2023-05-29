
export default function inventoryMapDetail(projectObj) {

    let contentWrapper = document.querySelector('.jsContentWrapper');

    let projectID = projectObj.ProjectID;
    let projectName = projectObj.ProjectName;
    let inventoryMapUrl = projectObj.InventoryMapUrl;

    let projectLotStatusLL = null;

    let projectLotRecords = [];

    async function mainHtml() {

        contentWrapper.innerHTML = '';

        let view = await globalFuncObj.fetchView(AppGlobal.baseUrl + `inventorymaplist`);

        let doc = new DOMParser().parseFromString(view, 'text/html').querySelector('.jsInventoryMapContainer');

        doc.querySelector('.jsProjectTitle').textContent = projectName;

        doc.querySelector('.projectlist-body').appendChild(await displayProjectInventoryMap());

        doc.querySelector('.jsBack').addEventListener('click', handleBackButtonClick);

        doc.querySelector('.projectList-header-title h3').textContent = 'Inventory Map Detail';

        doc.querySelector('.jsUploadNew').remove();

        contentWrapper.appendChild(doc);

    }

    function handleBackButtonClick() {
        history.back();
    }

    async function displayProjectInventoryMap() {

        let view = `
                    <div class="svgFileUploadContainer jsSvgFileContainer" style="height: calc(100vh - 224px)">
                        
                    </div>
                `;


        let doc = new DOMParser().parseFromString(view, 'text/html').querySelector('.jsSvgFileContainer');

        let svgEl;


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

            item.nextElementSibling.textContent = lotDetailObj.LotName;

            if (lotDetailObj.ProjectLotStatusID == 2) {
                //reserved
                item.setAttribute('style', 'fill: #FFB606');
            }

            else if (lotDetailObj.ProjectLotStatusID == 3) {
                item.setAttribute('style', 'fill: red');

            }

            else if (lotDetailObj.ProjectLotStatusID == 4) {
                item.setAttribute('style', 'fill: green');

            }

            item.parentElement.addEventListener("click", async function () {

                let data = await globalFuncObj.fetchDataGet(`${AppGlobal.baseUrl}inventory-map/projectlotupdateref/${lotID}/${projectID}`);

                projectLotStatusLL = null;

                projectLotStatusLL = globalFuncObj.loadDataList(data.StatusList, 'ID');

                showLotDetail(data.RecordData);
            });

        });

        return doc;
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

            console.log(data);

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

                            item.nextElementSibling.textContent = lotName;

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

            console.log(data);

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
                        statusColorCoding = '#FFB606';
                    }
                    else if (projectLotStatusID == 3) {
                        statusColorCoding = 'red';
                    }

                    else if (projectLotStatusID == 4) {
                        statusColorCoding = 'green';
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

            let { ProjectLotRecords } = await globalFuncObj.fetchDataGet(`${AppGlobal.baseUrl}inventory-map/getprojectlots/?masterProjectID=${projectID}`);

            projectLotRecords = ProjectLotRecords;

            await mainHtml();

            globalFuncObj.loader.stop();

        }
    }

}