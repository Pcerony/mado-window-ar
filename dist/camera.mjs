export function requestCamera(mediaDevices,facing='environment'){
  return mediaDevices.getUserMedia({video:{facingMode:{ideal:facing},width:{ideal:1280},height:{ideal:720},frameRate:{ideal:30,max:30}},audio:false}).catch(error=>{
    if(error.name==='OverconstrainedError')return mediaDevices.getUserMedia({video:{facingMode:{ideal:facing}},audio:false});
    throw error;
  });
}
export function cameraErrorMessage(name,userAgent=''){
  const browser=/CriOS|Chrome\//.test(userAgent)?'Chrome':/Safari/.test(userAgent)?'Safari':'ブラウザ';
  const errors={NotAllowedError:`${browser} のサイト設定と端末の設定で、カメラへのアクセスを許可してください。`,NotFoundError:'利用できるカメラが見つかりません。',NotReadableError:'ほかのアプリでカメラを使用中です。終了してからお試しください。',InsecureContext:'カメラには HTTPS が必要です。安全なページを開き直してください。',CameraUnsupported:'このブラウザではカメラを利用できません。Chrome または Safari で開いてください。',GraphicsError:'カメラは起動しましたが、AR の描画を読み込めませんでした。ページを更新してください。',OverconstrainedError:'カメラの設定を適用できませんでした。ほかのカメラを選ぶか、もう一度お試しください。'};
  return errors[name]||'カメラを開始できませんでした。ほかのカメラアプリを閉じて、もう一度お試しください。';
}
