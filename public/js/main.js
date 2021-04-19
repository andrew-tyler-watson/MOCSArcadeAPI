function showDeleteModal(gameId, gameName){
    fillDeleteModal(gameId, gameName)
    $('#gameDeleteModal').modal('show');
}
function fillDeleteModal(gameId, gameName){
    $('#deleteModalGameID').val(gameId);
    $("#gameNameDisplay").html(gameName)
}

function showDeleteCommentModal(gameId, commentText){
    fillDeleteCommentModal(gameId, commentText)
    $('#commentDeleteModal').modal('show');
}
function fillDeleteCommentModal(gameId, commentText){
    $('#deleteModalCommentID').val(gameId);
    $("#commentDisplay").html(commentText)
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
