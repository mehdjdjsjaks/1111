// متغیرهای اصلی
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const zoomDisplay = document.getElementById('zoomDisplay');
const flash = document.getElementById('flash');
const permissionRequest = document.getElementById('permissionRequest');
const fullscreenPreview = document.getElementById('fullscreenPreview');
const previewImage = document.getElementById('previewImage');

// کنترل‌ها
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const zoomSlider = document.getElementById('zoomSlider');
const captureBtn = document.getElementById('capture');
const switchCameraBtn = document.getElementById('switchCamera');
const savePhotoBtn = document.getElementById('savePhoto');
const closePreviewBtn = document.getElementById('closePreview');

// تنظیمات دوربین
let currentStream = null;
let currentZoom = 1;
const maxZoom = 100;
let facingMode = 'environment';
let isFrontCamera = false;

// شروع خودکار دوربین بعد از لود صفحه
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await startCamera();
    } catch (error) {
        console.error('خطا در شروع دوربین:', error);
    }
});

// شروع دوربین
async function startCamera() {
    stopCamera(); // ابتدا دوربین قبلی را متوقف می‌کنیم
    
    const constraints = {
        video: {
            facingMode: facingMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 }
        },
        audio: false
    };
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    } catch (err) {
        handleError(err);
    }
}

function handleSuccess(stream) {
    currentStream = stream;
    video.srcObject = stream;
    currentZoom = 1;
    updateZoomDisplay();
    
    // مخفی کردن پیام درخواست دسترسی
    permissionRequest.style.display = 'none';
    
    video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    };
}

function handleError(error) {
    console.error('خطا در دسترسی به دوربین:', error);
    // نمایش پیام خطا به کاربر
    permissionRequest.querySelector('h2').textContent = 'خطا در دسترسی به دوربین. لطفاً مجوزها را بررسی کنید.';
    permissionRequest.style.display = 'flex';
}

// بقیه توابع بدون تغییر باقی می‌مانند...
// توقف دوربین
function stopCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
        video.srcObject = null;
    }
}

// تغییر دوربین
function switchCamera() {
    isFrontCamera = !isFrontCamera;
    facingMode = isFrontCamera ? 'user' : 'environment';
    startCamera();
}

// اعمال زوم
function applyZoom() {
    video.style.transform = `scale(${currentZoom})`;
    updateZoomDisplay();
}

// نمایش سطح زوم
function updateZoomDisplay() {
    zoomDisplay.textContent = `${currentZoom}x`;
    zoomDisplay.style.opacity = '1';
    zoomSlider.value = currentZoom;
    
    setTimeout(() => {
        zoomDisplay.style.opacity = '0';
    }, 1000);
}

// گرفتن عکس
function capturePhoto() {
    if (!currentStream) return;
    
    // فلش دوربین
    flash.style.opacity = '0.8';
    setTimeout(() => {
        flash.style.opacity = '0';
    }, 200);
    
    // رسم تصویر روی کانواس با زوم اعمال شده
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.scale(currentZoom, currentZoom);
    ctx.translate(-canvas.width/2, -canvas.height/2);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    // نمایش پیش‌نمایش تمام صفحه
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    previewImage.src = imageData;
    fullscreenPreview.style.display = 'flex';
}

// ذخیره عکس
function savePhoto() {
    const link = document.createElement('a');
    link.href = previewImage.src;
    link.download = `عکس-دوربین-${new Date().toISOString().slice(0, 10)}.jpg`;
    link.click();
}

// بستن پیش‌نمایش
function closePreview() {
    fullscreenPreview.style.display = 'none';
}

// رویدادها
zoomInBtn.addEventListener('click', () => {
    if (currentZoom < maxZoom) {
        currentZoom += 1;
        applyZoom();
    }
});

zoomOutBtn.addEventListener('click', () => {
    if (currentZoom > 1) {
        currentZoom -= 1;
        applyZoom();
    }
});

zoomSlider.addEventListener('input', () => {
    currentZoom = parseInt(zoomSlider.value);
    applyZoom();
});

captureBtn.addEventListener('click', capturePhoto);
switchCameraBtn.addEventListener('click', switchCamera);
savePhotoBtn.addEventListener('click', savePhoto);
closePreviewBtn.addEventListener('click', closePreview);

// توقف دوربین هنگام بستن صفحه
window.addEventListener('beforeunload', stopCamera);
