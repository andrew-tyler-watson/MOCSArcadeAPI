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
function fillDeleteModal(gameName, gameDescription){
    document.getElementById('deleteModalGameName').textContent = gameName;
    document.getElementById("deleteModalGameDescription").textContent = gameDescription;
}

function approveGame(gameName){
    $('#redirectTo').val(window.location.pathname)
    document.getElementById(gameName + 'IdApproveForm').submit()
}

function submitGameAddForm(){
    $("#addGameForm").submit()
}