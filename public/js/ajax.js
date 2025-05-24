
function ajaxRequest(url, type = 'GET', data = {}, successCallback, errorCallback) {
    $.ajax({
        url: url,
        type: type,
        data: data,
        dataType: 'json',
        success: function(response) {
            if (successCallback) successCallback(response);
        },
        error: function(xhr, status, error) {
            console.error(`[AJAX 오류] ${url}:`, error);
            if (errorCallback) errorCallback(xhr, status, error);
        }
    });
}