var GoogleCalendarIDs = [
  //TODO 請替換成自己要通知的 Gmail_Caneddar 帳號//PHP群組日曆
  ];//所有要發送的群組
var LineNotifyEndPoint = "https://notify-api.line.me/api/notify";
var AccessToken = /*TODO 請替換成自己申請的LineNotify AccessToken */"";
const Now = new Date();
const TomorrowStart = new Date(Now.getFullYear(), Now.getMonth(),Now.getDate()+ 1, 0, 0, 0, 0);
const TomorrowEnd = new Date(Now.getFullYear(), Now.getMonth(), Now.getDate()+ 1, 23, 59, 59, 999);

// 監聽觸發條件所設置的
// 彙整行事曆資訊
function postMessage() {
  GoogleCalendarIDs.forEach(GoogleCalendarID => {
    let GoogleCalendar = CalendarApp.getCalendarById(GoogleCalendarID).getEvents(TomorrowStart, TomorrowEnd);
        GoogleCalendar.forEach(item=> {
      var message = "";
      message += '項目主題:';
      message += (item.getTitle() == "") ?  ("NA\n") : (item.getTitle() + "\n") ;
      message += '開始時間：';
      message += item.getStartTime() + "\n" ;
      sendMessage(message);
    })
  })
}

// 發出訊息
function sendMessage(message) {
  var formData = {
    "message": message
  };
  var options = {
    "headers" : {"Authorization" : "Bearer " + AccessToken},
    "method" : 'post',
    "payload" : formData
  };

  try {
    var response = UrlFetchApp.fetch(LineNotifyEndPoint, options);
  }
  catch (error) {
    Logger.log(error.name + "：" + error.message);
    return;
  }

  if (response.getResponseCode() !== 200) {
    Logger.log("送出失敗");
  }
}