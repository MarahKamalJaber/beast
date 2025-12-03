<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Beast Burger Spin</title>

    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Cairo', sans-serif;
            background: #7a1824;
            color: #fff;
            text-align: center;
            overflow-x: hidden;
        }

        body::before {
            content: "BEAST BURGER BEAST BURGER BEAST BURGER BEAST BURGER ";
            position: fixed;
            top: -15%;
            left: -25%;
            width: 180%;
            height: 180%;
            font-size: 80px;
            font-weight: 900;
            color: rgba(0,0,0,0.12);
            transform: rotate(-28deg);
            z-index: -1;
        }

        .logo {
            width: 135px;
            margin: 25px auto 10px;
            display: block;
        }

        .machine {
            width: 92%;
            max-width: 480px;
            margin: 35px auto 0;
            background: linear-gradient(180deg,#ff8a20,#ff5a00);
            padding: 28px 20px 40px;
            border-radius: 38px;
            box-shadow: 0 0 50px rgba(0,0,0,0.45);
            position: relative;
        }

        .screen {
            background: #0a0607;
            border-radius: 28px;
            padding: 30px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .reel {
            width: 90px;
            height: 90px;
            background: #1a0f13;
            border-radius: 20px;
            font-size: 52px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        @media (max-width:600px) {
            .reel {
                width: 72px;
                height: 72px;
                font-size: 44px;
            }
        }

        /* الذراع */
        .lever-box {
            position: absolute;
            left: -5px;
            bottom: -40px;
            transform: rotate(12deg);
        }

        .lever {
            cursor: pointer;
            width: 90px;
            transition: .25s ease;
        }

        .lever-stick {
            width: 16px;
            height: 90px;
            background: #000;
            border-radius: 10px;
            margin: 0 auto;
        }

        .lever-ball {
            width: 55px;
            height: 55px;
            background: #ffb58d;
            border-radius: 50%;
            box-shadow: 0 8px 16px rgba(0,0,0,0.55);
            margin-top: -12px;
        }

        .instructions {
            margin-top: 50px;
            font-size: 18px;
            line-height: 1.7;
            padding: 0 10px;
        }

        #popup,
        #phonePopup {
            position: fixed;
            top:0; left:0;
            width:100%; height:100%;
            background:rgba(0,0,0,0.85);
            display:none;
            justify-content:center;
            align-items:center;
            z-index:9999;
        }

        .popup-box,
        .phone-box {
            background:#0f0a0a;
            border:3px solid #ff6a00;
            padding:25px;
            border-radius:18px;
            width:85%;
            max-width:350px;
            text-align:center;
        }

        .phone-box {
            background:white;
            color:black;
            border:none;
        }
    </style>
</head>
<body>

<img src="https://raw.githubusercontent.com/MarahKamalJaber/beast/main/logo.png" class="logo">

<div class="machine">
    <div class="screen">
        <div id="r1" class="reel">🍔</div>
        <div id="r2" class="reel">🥗</div>
        <div id="r3" class="reel">🍖</div>
    </div>

    <!-- الذراع -->
    <div class="lever-box">
        <div id="lever" class="lever">
            <div class="lever-stick"></div>
            <div class="lever-ball"></div>
        </div>
    </div>
</div>

<div class="instructions">
😈 ادخل رقمك وجرب حظّك مع الوحش<br>
🎯 ممكن تربح برجر، سلطة، أجنحة<br><br>
👉 <b>اضغط على الذراع لتشغيل اللعبة</b>
</div>

<!-- نتيجة -->
<div id="popup">
    <div class="popup-box">
        <h2 id="popupTitle">مبروووك!</h2>
        <div id="popupEmoji" style="font-size:40px;">🔥🍔🔥</div>
        <p id="popupMsg"></p>

        <a id="waLink" href="#" target="_blank"
           style="display:none;margin-top:15px;padding:12px;background:#25D366;color:white;
           border-radius:10px;font-size:18px;text-decoration:none;font-weight:bold;">
            تواصل عبر واتساب 📩
        </a>
    </div>
</div>

<!-- إدخال رقم -->
<div id="phonePopup" style="display:flex;">
    <div class="phone-box">
        <h2>أدخل رقم جوالك</h2>
        <p>محاولة واحدة فقط</p>
        <input id="phoneInput" type="tel" placeholder="059XXXXXXX"
               style="width:95%;padding:12px;border-radius:10px;border:2px solid #ff5a00;font-size:18px;">
        <button onclick="submitPhone()"
                style="margin-top:15px;width:100%;padding:12px;font-size:18px;background:#ff5a00;color:white;border:none;border-radius:10px;">
            متابعة
        </button>
    </div>
</div>

<!-- (اختياري) ملفك القديم -->
<script src="client.min.js"></script>

<!-- FingerprintJS من CDN -->
<script src="https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js"
        crossorigin="anonymous"></script>

<script>
/* ---------------- متغيرات عامة ---------------- */

const API_URL = "/api/proxy";

let deviceId = null;
let clientIp = null;
let phone = "";
let allowed = false;
let spinning = false;

const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupEmoji = document.getElementById("popupEmoji");
const popupMsg = document.getElementById("popupMsg");
const waLink = document.getElementById("waLink");
const phonePopup = document.getElementById("phonePopup");
const phoneInput = document.getElementById("phoneInput");
const lever = document.getElementById("lever");

/* ---------------- (1) أدوات تخزين الـ ID في كل مكان ---------------- */

function readFromStorages(key) {
    try {
        if (localStorage.getItem(key)) return localStorage.getItem(key);
    } catch(e){}
    try {
        if (sessionStorage.getItem(key)) return sessionStorage.getItem(key);
    } catch(e){}
    try {
        const cookies = document.cookie.split(";");
        for (let c of cookies) {
            c = c.trim();
            if (c.startsWith(key + "=")) return c.substring((key + "=").length);
        }
    } catch(e){}
    return null;
}

function writeToStorages(key, value) {
    try { localStorage.setItem(key, value); } catch(e){}
    try { sessionStorage.setItem(key, value); } catch(e){}
    try {
        document.cookie = key + "=" + value + "; max-age=31536000; path=/";
    } catch(e){}
}

/* توليد ID احتياطي */
function generateFallbackId() {
    const raw = [
        navigator.userAgent,
        navigator.language,
        screen.width,
        screen.height,
        Date.now(),
        Math.random()
    ].join("|");

    let h = 0;
    for (let i = 0; i < raw.length; i++) {
        h = (h << 5) - h + raw.charCodeAt(i);
        h |= 0;
    }
    return "FB_" + Math.abs(h);
}

/* FingerprintJS */
const fpPromise = FingerprintJS.load();

/* الحصول على ID نهائي للجهاز */
async function buildDeviceId() {
    // 1) حاول تقرأ الـ ID من التخزينات
    const stored = readFromStorages("bbid");
    if (stored) {
        writeToStorages("bbid", stored);
        return stored;
    }

    // 2) حاول تستخدم FingerprintJS
    try {
        const fp = await fpPromise;
        const result = await fp.get();
        const id = "FP_" + result.visitorId;
        writeToStorages("bbid", id);
        return id;
    } catch (e) {
        console.error("Fingerprint error:", e);
    }

    // 3) fallback نهائي
    const fb = generateFallbackId();
    writeToStorages("bbid", fb);
    return fb;
}

/* ---------------- (2) الحصول على IP عام للجهاز ---------------- */

async function getPublicIp() {
    try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        return data.ip || null;
    } catch (e) {
        console.error("IP fetch error:", e);
        return null;
    }
}

/* ---------------- (3) تهيئة عند فتح الصفحة ---------------- */

async function initGame() {
    clientIp = await getPublicIp();
    deviceId = await buildDeviceId();
    await checkDevice();
}

document.addEventListener("DOMContentLoaded", initGame);

/* ---------------- (4) فحص الجهاز أول ما يدخل ---------------- */

async function checkDevice() {
    if (!deviceId) return;

    const params = new URLSearchParams({
        action: "checkDeviceOnly",
        deviceId: deviceId,
        ip: clientIp || ""
    });

    try {
        const res = await fetch(`${API_URL}?${params}`).then(r => r.json());

        if (!res.allowed) {
            // ممنوع لعب نهائياً على هذا الجهاز
            phonePopup.style.display = "none";
            document.querySelector(".machine").style.display = "none";
            lever.style.pointerEvents = "none";

            document.querySelector(".instructions").innerHTML = `
                <h2 style="font-size:26px;margin-bottom:10px;">🚫 ممنوع اللعب</h2>
                <p style="font-size:20px;">هذا الجهاز استخدم اللعبة مسبقًا ولا يمكنه اللعب مرة أخرى 😈</p>
            `;

            allowed = false;
            spinning = true;
        }
    } catch (e) {
        console.error("checkDevice error:", e);
    }
}

/* ---------------- (5) إدخال الرقم ---------------- */

async function submitPhone() {
    if (!deviceId) {
        alert("في مشكلة في التعرف على الجهاز، حدّث الصفحة وحاول مرة أخرى.");
        return;
    }

    phone = phoneInput.value.trim();
    if (phone.length < 7) return alert("رقم غير صالح");

    const params = new URLSearchParams({
        action: "checkPhone",
        phone: phone,
        deviceId: deviceId,
        ip: clientIp || ""
    });

    try {
        const res = await fetch(`${API_URL}?${params}`).then(r => r.json());

        if (!res.allowed) {
            if (res.reason === "device_exists" || res.reason === "ip_exists")
                return alert("هذا الجهاز استخدم اللعبة مسبقاً 😈");
            if (res.reason === "phone_exists")
                return alert("هذا الرقم لعب مسبقاً 😈");
            return alert("غير مسموح باللعب.");
        }

        // تسجيل المحاولة الأولى
        fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                action: "registerPhone",
                phone: phone,
                deviceId: deviceId,
                ip: clientIp || ""
            })
        });

        phonePopup.style.display = "none";
        allowed = true;
    } catch (e) {
        console.error("submitPhone error:", e);
        alert("في مشكلة في الاتصال، حاول مرة أخرى.");
    }
}

/* ---------------- (6) الذراع ---------------- */

lever.onclick = function () {
    if (!allowed) return alert("يجب إدخال رقم الجوال أولاً");
    if (spinning) return;

    spinning = true;
    startSpin();

    fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            action: "played",
            phone: phone,
            deviceId: deviceId,
            ip: clientIp || ""
        })
    });
};

/* ---------------- (7) السبين ---------------- */

function startSpin() {
    let result = [];
    const symbols = ["🍔","🥗","🍖","🍟"];

    const isWin = Math.random() < 0.10;
    let forcedType = null;

    if (isWin) {
        const r = Math.random();
        if (r < 0.01) forcedType = "burger";
        else if (r < 0.46) forcedType = "salad";
        else forcedType = "wings";
    }

    ["r1","r2","r3"].forEach((id, idx) => {
        let reel = document.getElementById(id);

        let interval = setInterval(() => {
            reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        }, 80);

        setTimeout(() => {
            clearInterval(interval);

            let final = forcedType
                ? (forcedType === "burger" ? "🍔"
                   : forcedType === "salad" ? "🥗"
                   : "🍖")
                : symbols[Math.floor(Math.random() * symbols.length)];

            reel.textContent = final;
            result[idx] = final;

            if (idx === 2)
                setTimeout(() => checkResult(result, forcedType), 600);

        }, 4200 + idx * 400);
    });
}

/* ---------------- (8) النتيجة ---------------- */

function checkResult(arr, forced) {
    if (forced) {
        spinning = false;
        allowed = false;
        return showWin(forced);
    }

    if (arr[0] === arr[1] && arr[1] === arr[2]) {
        if (arr[0] === "🍔") return showWin("burger");
        if (arr[0] === "🥗") return showWin("salad");
        if (arr[0] === "🍖") return showWin("wings");
    }

    spinning = false;
    allowed = false;
    showLose();
}

/* ---------------- (9) الفوز ---------------- */

function showWin(type) {
    popup.style.display = "flex";
    popupTitle.textContent = "مبروووك! 🎉";

    if (type === "burger") {
        popupEmoji.textContent = "🍔";
        popupMsg.textContent = "ربحت وجبة برغر!";
    } else if (type === "salad") {
        popupEmoji.textContent = "🥗";
        popupMsg.textContent = "ربحت سلطة!";
    } else {
        popupEmoji.textContent = "🍖";
        popupMsg.textContent = "ربحت أجنحة!";
    }

    waLink.href = `https://wa.me/972599443332?text=${encodeURIComponent("ربحت من لعبة Beast Burger 🎉")}`;
    waLink.style.display = "block";
}

/* ---------------- (10) الخسارة ---------------- */

function showLose() {
    popup.style.display = "flex";
    popupTitle.textContent = "حظاً أوفر 😈";
    popupEmoji.textContent = "😈";
    popupMsg.textContent = "حظاً أوفر!";
    waLink.style.display = "none";
}
</script>

</body>
</html>
