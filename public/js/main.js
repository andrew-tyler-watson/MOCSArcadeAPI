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

function checkFileSize (e) {
    for(file of this.files) {
        console.log(file)
        if(file.size > 50000) {
            $(this).val("")
            $("#fileError").text("File is too large! Please decrease the size of your file to 50KB and try again!")
        } else {
            $("#fileError").text("")
        }
    }
}