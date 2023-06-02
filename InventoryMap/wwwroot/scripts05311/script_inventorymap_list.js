
export default function inventoryMapList(projectObj) {

    let contentWrapper = document.querySelector('.jsContentWrapper');

    let projectID = projectObj.ProjectID;
    let projectName = projectObj.ProjectName;

    let inventoryMaps = [];

    async function mainHtml() {

        contentWrapper.innerHTML = '';

        let view = await globalFuncObj.fetchView(AppGlobal.baseUrl + `inventorymaplist`);

        let doc = new DOMParser().parseFromString(view, 'text/html').querySelector('.jsInventoryMapContainer');

        contentWrapper.appendChild(doc);

        contentWrapper.querySelector('.jsProjectTitle').textContent = projectName;

        contentWrapper.querySelector('.jsBack').addEventListener('click', handleBackButtonClick);

        contentWrapper.querySelector('.jsUploadNew').setAttribute('data-id', projectID);

        contentWrapper.querySelector('.jsUploadNew').setAttribute('data-name', projectName);


        displayRecord();

    }

    function displayRecord() {

        let tblContainer = contentWrapper.querySelector('.projectlist-body');

        tblContainer.innerHTML = '';

        if (inventoryMaps.length > 0) {

            inventoryMaps.forEach((item, index) => {

                let viewClone = tblBodyItem();

                //console.log(viewClone);

                viewClone.setAttribute('data-id', projectID);
                viewClone.setAttribute('data-name', projectName);
                viewClone.setAttribute('data-url', item.ImageFileUrl);
                viewClone.setAttribute('data-caption', item.ImageCaption);

                viewClone.querySelector('.jsProjectName').textContent = item.ImageCaption;

                tblContainer.appendChild(viewClone);

            });
        }
        else {
            let emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-project';
            emptyDiv.setAttribute('style', 'width: 100%; text-align: center; font-size: 14px; padding: 5px;');
            emptyDiv.textContent = 'No image found.'

            tblContainer.appendChild(emptyDiv);
        }

        function tblBodyItem() {
            let view = `
                 <a href="${AppGlobal.baseUrl}inventorymap-detail" class=" projectlist-tr project-tr1 data-link jsCloneProject">
                    <div class="projectlist-icon">
                        <i>
                            <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24"><path d="M19.5,3h-4.5c-.232,0-.464-.055-.671-.158l-3.156-1.578c-.345-.173-.732-.264-1.118-.264h-2.556C5.019,1,3,3.019,3,5.5V15.5c0,2.481,2.019,4.5,4.5,4.5h12c2.481,0,4.5-2.019,4.5-4.5V7.5c0-2.481-2.019-4.5-4.5-4.5ZM7.5,2h2.556c.231,0,.464,.055,.671,.158l3.155,1.578c.345,.173,.731,.264,1.118,.264h4.5c1.76,0,3.221,1.306,3.464,3H4v-1.5c0-1.93,1.57-3.5,3.5-3.5Zm12,17H7.5c-1.93,0-3.5-1.57-3.5-3.5v-7.5H23v7.5c0,1.93-1.57,3.5-3.5,3.5Zm.5,3.5c0,.276-.224,.5-.5,.5H4.5c-2.481,0-4.5-2.019-4.5-4.5V7.5c0-.276,.224-.5,.5-.5s.5,.224,.5,.5v11c0,1.93,1.57,3.5,3.5,3.5h15c.276,0,.5,.224,.5,.5Z"/></svg>
                        </i>
                    </div>
                    <div class="projectlist-name">
                        <span href="" class="jsProjectName"></span>
                    </div>
                <a>`;

            return new DOMParser().parseFromString(view, 'text/html').querySelector('.jsCloneProject');
        }
    }


    function handleBackButtonClick() {
        history.back();
    }

    return {
        init: async function () {

            globalFuncObj.loader.start();

            let { InventoryMap } = await globalFuncObj.fetchDataGet(`${AppGlobal.baseUrl}inventorymapimage/?id=${projectID}`);

            inventoryMaps = InventoryMap;
            
            await mainHtml();

            globalFuncObj.loader.stop();

        }
    }

}