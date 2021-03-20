function showDeleteModal(gameId, gameName, gameDescription){
    fillDeleteModal(gameId, gameName, gameDescription)
    $('#gameDeleteModal').modal('show');
}
function fillDeleteModal(gameId, gameName, gameDescription){
    $('#deleteModalGameID').val(gameId);
    $("#deleteModalGameDescription").val(gameDescription);
    $("#gameNameDisplay").html(gameName)
}

function showReportModal(gameId, gameName, versionNumber){
    fillReportModal(gameId, gameName, versionNumber)
    $('#gameReportModal').modal('show');
}
function fillReportModal(gameId, gameName, versionNumber){
    $('#ReportModalGameId').val(gameId);
    $('#ReportModalVersionNumber').val(versionNumber);
    $('#versionNumberDisplay').html(versionNumber);
    $("#gameNameDisplay").html(gameName)
}

function approveGame(gameName){
    $('.redirectTo').val(window.location.pathname)
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
