function showDeleteModal(gameName, gameDescription){
    //console.log(gameElementId);
    fillDeleteModal(gameName, gameDescription)
    $('#gameDeleteModal').modal({onApprove: function(event) {
        $('#gameDeleteModal').modal({
            transition: 'fade',
            duration: 10000
        }).modal('hide');
        deleteGame(gameName);
    }}).modal('show');
}
function deleteGame(gameName)
{
    //console.log('deleted')
    document.getElementById(gameName+'DeleteForm').submit()
}
function showUpdateModal(gameName, gameDescr){
    //console.log(gameElementId);
    fillUpdateModal(gameName, gameDescr);
    $('#gameUpdateModal').modal({onApprove: function(event) {
        $('#gameUpdateModal').modal({
            transition: 'fade',
            duration: 10000
        }).modal('hide');
        updateGame(gameName);
    }}).modal('show');
}
function updateGame(gameElementId)
{
    //console.log('deleted')
    document.getElementById('gameUpdateForm').submit()
}
function fillUpdateModal(gameName, gameDescription){
    document.getElementById('gameToUpdateNameInput').value = gameName;
    document.getElementById('updateModalGameName').textContent = gameName;
    document.getElementById("updateModalGameDescription").textContent = gameDescription;
    
}
function fillDeleteModal(gameName, gameDescription){
    document.getElementById('deleteModalGameName').textContent = gameName;
    document.getElementById("deleteModalGameDescription").textContent = gameDescription;
}

function approveGame(gameName){
    document.getElementById(gameName + 'IdApproveForm').submit()
}