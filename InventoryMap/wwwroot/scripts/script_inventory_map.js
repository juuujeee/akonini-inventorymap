


export default function inventoryMap(projectObj) {

    let contentWrapper = document.querySelector('.jsContentWrapper');

    let projectID = projectObj.ProjectID;
    let projectName = projectObj.ProjectName;

    let svgDoc = null;
    let file = null;

    let inventoryMapFileName = null;
    let inventoryMapFileNameURL = null;

    async function mainHtml() {

        contentWrapper.innerHTML = '';

        let view = await globalFuncObj.fetchView(AppGlobal.baseUrl + `inventorymapupload`);

        let doc = new DOMParser().parseFromString(view, 'text/html').querySelector('.jsInventoryMapContainer');

        let svgContainer = doc.querySelector('.jsSvgFileContainer');

        let svgFileInput = doc.querySelector('.jsSVGFileInput');

        let uploadBtn = doc.querySelector('.jsUploadBtn');

        svgContainer.addEventListener('click', handleClickSVGUploadContainer);

        svgFileInput.addEventListener('change', handleSVGFileInputChange)

        uploadBtn.addEventListener('click', handleClickUploadBtn);

        if (inventoryMapFileName != null) {

            doc.querySelector('.projectList-header-title h3').textContent = 'Project Inventory Map';
            doc.querySelector('.projectlist-body').innerHTML = '';

            doc.querySelector('.projectlist-body').appendChild(await displayProjectInventoryMap());
        }


        doc.querySelector('.jsProjectTitle').textContent = projectName;

        doc.querySelector('.jsBack').addEventListener('click', handleBackButtonClick);

        //doc.querySelector('.jsClickDialog').addEventListener('click', function (e) {
        //    document.querySelector('#favDialog').showModal();

        //})

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

        await fetch(inventoryMapFileNameURL)
            .then(response => response.text())
            .then(svgText => {

                svgEl = new DOMParser().parseFromString(svgText, 'text/html').querySelector('svg');

            })
            .catch(error => {
                console.error("Error fetching SVG file:", error);
            });

        doc.appendChild(svgEl);

        doc.querySelectorAll('[data-lotid]').forEach((item) => {

            item.parentElement.addEventListener("click", async function () {

                let lotID = item.getAttribute('data-lotid');

                showLotDetail(lotID);
            });

        });


        return doc;
    }

    function showLotDetail(lotID) {

        let modalContentCss = "width: 95%; margin-left: auto; margin-right: auto; top: 50%; transform: translateY(-50%); left: unset";

        const modalView = `<div class="modal-container jsModal">
                                    <div class="modal-content" style="${modalContentCss}">
                                        <div class="modal-header">
                                            <h2 class="jsTitleName">Lot Detail</h2>
                                            <span class="close-modal jsCloseModal">✕</span>
                                        </div>
                                        <div class="modal-body">
                                            <input type="hidden" name="LotID" class="jsLotID" value="${lotID}"/>
                                            <div class="project-form-group">
                                               <input type="text" class="jsProjectName" placeholder="Project Name" value="${projectName}" required />
                                            </div>
                                            <div class="project-form-group">
                                               <input type="text" class="jsLotName" placeholder="Lot Name" required />
                                            </div>
                                            <div class="project-form-group">
                                                <div class="dropdown-container hasDropdown">
                                                    <input type="text" name="Status" class="jsStatus dropdown-container-input" placeholder="Status" required>
                                                    <i class="dropdown-container-icon">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path></svg>
                                                    </i>
                                                </div>
                                            </div>
                                               
                                            <button class="jsSaveNewProject modal-saveProject">Update</button>
                                        </div>
                                    </div>
                                </div>`;

        const modalParse = new DOMParser().parseFromString(modalView, 'text/html').querySelector('.jsModal');

        modalParse.querySelector('.jsCloseModal').addEventListener('click', function (e) {

            this.closest('.jsModal').remove()
        });

        document.body.append(modalParse);
    }

    async function handleClickUploadBtn(e) {

        let uploadAzureFunc = await uploadAzure();

        console.log(uploadAzureFunc);

        if (uploadAzureFunc.StatusCodeNumber == 1) {

            let formData = new FormData();

            formData.append('SVGFileName', uploadAzureFunc.FileName);
            formData.append('MasterProjectID', projectID);

            extractSVG().forEach((item, index) => {

                formData.append(`ProjectLots[${index}].MasterProjectID`, projectID);
                formData.append(`ProjectLots[${index}].LotID`, item);

            });

            saveToDatabase(formData);
        }

    }

    async function saveToDatabase(formData) {

        let data = await globalFuncObj.fetchDataPost(AppGlobal.baseUrl + 'inventory-map/new', formData);

        if (data.HasError) {
            throw alertMessages.databaseError
        }
        else {
            if (data.StatusCodeNumber == 1) {

                globalFuncObj.isConfirmedAlertOk(alertType.successAlert, 'Saved Successfully.');
            }

            else if(data.StatusCodeNumber == 2){
                globalFuncObj.isConfirmedAlertOk(alertType.warningAlert, 'Inventory Map already exists');

            }
        }

    }

    function extractSVG() {

        let dataLotID = [];

        svgDoc.querySelectorAll('[data-lotid]').forEach((item) => {

            dataLotID.push(item.getAttribute('data-lotid'));

        });

        return dataLotID;

    }

    async function uploadAzure() {

        let fileFormData = new FormData();
        fileFormData.append('file', file);

        let fileData = await globalFuncObj.fetchUploadFile('https://akonini-files.azurewebsites.net/uploadsvg', fileFormData);

        return fileData;
    }

    function handleClickSVGUploadContainer(e) {

        e.currentTarget.querySelector('.jsSVGFileInput').click();
    }

    async function handleSVGFileInputChange(e) {

        let parentEl = e.target.closest('.jsSvgFileContainer');

        let filePart = this.files[0].name.split('.');

        let fileType = filePart[filePart.length - 1];

        file = this.files[0];

        //console.log(this.files[0]);

        if (fileType == 'svg') {

            const reader = new FileReader();

            reader.onload = async function () {

                parentEl.querySelector('.jsSVGFilePreview').src = reader.result;

                parentEl.querySelector('small').setAttribute('style', 'display: none');


                await fetch(reader.result).then(function (obj) {

                    return obj.text();

                }).then(function (data) {

                    //console.log(data);

                    svgDoc = new DOMParser().parseFromString(data, 'text/html').querySelector('svg');

                    //console.log(svgDoc);
                })
            }

            reader.readAsDataURL(this.files[0]);


            
        }
    }

    return {
        init: async function () {

            globalFuncObj.loader.start();

            let data = await globalFuncObj.fetchDataGet(`${AppGlobal.baseUrl}inventorymapimage/?id=${projectID}`);

            console.log(data);

            if (!data.HasError) {
                inventoryMapFileName = data.ImageFileName;
                inventoryMapFileNameURL = data.ImageFileUrl;
            }

            await mainHtml();

            globalFuncObj.loader.stop();


        }
    }

}