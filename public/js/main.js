function showDeleteModal(gameName, gameDescription){
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

function changeImageFileLabel(){
    //document.getElementById('imageFileLabel').textContent = document.getElementById('image').value
    // console.log(document.getElementById('imageFileLabel').textContent)
    // document.getElementById('fileError').innerHTML = "does it change"
    // console.log(document.getElementById('imageFileLabel').textContent)
    var filename = $("#gameAddModal").find("#image")[0].value
    console.log(filename)
    $("#gameAddModal").find("#imageFileLabel").text(filename)
    
}
