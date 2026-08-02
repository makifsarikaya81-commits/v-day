const gifStages = [
    "images/stitch-normal.gif",      // Normal
    "images/stitch-confused.gif",    // Şaşkın
    "images/stitch-pleading.gif",    // Yalvaran
    "images/stitch-sad.gif",         // Üzgün
    "images/stitch-sadder.gif",      // Daha üzgün
    "images/stitch-heartbroken.gif", // Kalbi kırık
    "images/stitch-crying.gif",      // Ağlayan
    "images/stitch-runaway.gif"      // Kaçan
];

const noMessages = [
    "Hayır",
    "Ece, emin misin? 🤨",
    "Lütfen bir daha düşün... 🥺",
    "Hayır dersen Stitch çok üzülecek...",
    "Gerçekten çok üzüleceğim 😢",
    "Lütfennn Ece 💔",
    "Bunu bana yapma...",
    "Son kararın mı? 😭",
    "Zaten beni yakalayamazsın 😜"
];

const yesTeasePokes = [
    "Önce bir kere Hayır'a bas bakalım... 😏",
    "Hayır butonunda küçük bir sürpriz var 👀",
    "Bir şeyleri kaçırıyorsun Ece 😈",
    "Hadi Hayır'a basmaya cesaretin var mı? 😏"
];

let yesTeasedCount = 0;
let noClickCount = 0;
let runawayEnabled = false;
let musicPlaying = true;

const catGif = document.getElementById("cat-gif");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const music = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");

/*
Tarayıcılar sesi kullanıcı etkileşimi olmadan
otomatik başlatmayı engelleyebilir.
*/
if (music) {
    music.muted = true;
    music.volume = 0.3;

    music.play()
        .then(() => {
            music.muted = false;
        })
        .catch(() => {
            document.addEventListener(
                "click",
                () => {
                    music.muted = false;
                    music.play().catch(() => {});
                },
                { once: true }
            );
        });
}

function toggleMusic() {
    if (!music) return;

    if (musicPlaying) {
        music.pause();
        musicPlaying = false;

        if (musicToggle) {
            musicToggle.textContent = "🔇";
        }
    } else {
        music.muted = false;
        music.play().catch(() => {});
        musicPlaying = true;

        if (musicToggle) {
            musicToggle.textContent = "🔊";
        }
    }
}

function handleYesClick() {
    /*
    İlk başta Evet butonuna basıldığında,
    kullanıcıyı bir kere Hayır'a basmaya teşvik eder.
    */

    if (!runawayEnabled) {
        const messageIndex = Math.min(
            yesTeasedCount,
            yesTeasePokes.length - 1
        );

        showTeaseMessage(yesTeasePokes[messageIndex]);
        yesTeasedCount++;
        return;
    }

    window.location.href = "yes.html";
}

function showTeaseMessage(message) {
    const toast = document.getElementById("tease-toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toast._timer);

    toast._timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function handleNoClick() {
    noClickCount++;

    /*
    Hayır butonunun yazısını her tıklamada değiştir.
    */
    const messageIndex = Math.min(
        noClickCount,
        noMessages.length - 1
    );

    noBtn.textContent = noMessages[messageIndex];

    /*
    Evet butonunu her tıklamada büyüt.
    */
    const currentYesSize = parseFloat(
        window.getComputedStyle(yesBtn).fontSize
    );

    yesBtn.style.fontSize = `${currentYesSize * 1.3}px`;

    const paddingY = Math.min(18 + noClickCount * 5, 60);
    const paddingX = Math.min(45 + noClickCount * 10, 120);

    yesBtn.style.padding = `${paddingY}px ${paddingX}px`;

    /*
    Hayır butonunu küçült.
    */
    if (noClickCount >= 2) {
        const currentNoSize = parseFloat(
            window.getComputedStyle(noBtn).fontSize
        );

        noBtn.style.fontSize =
            `${Math.max(currentNoSize * 0.85, 10)}px`;
    }

    /*
    Stitch GIF'ini değiştir.
    */
    const gifIndex = Math.min(
        noClickCount,
        gifStages.length - 1
    );

    swapGif(gifStages[gifIndex]);

    /*
    Beşinci tıklamadan sonra Hayır butonu kaçmaya başlar.
    */
    if (noClickCount >= 5 && !runawayEnabled) {
        enableRunaway();
        runawayEnabled = true;

        showTeaseMessage(
            "Artık Hayır butonunu yakalamak biraz zor 😜💙"
        );
    }
}

function swapGif(source) {
    if (!catGif) return;

    catGif.style.opacity = "0";

    setTimeout(() => {
        catGif.src = source;
        catGif.style.opacity = "1";
    }, 200);
}

function enableRunaway() {
    noBtn.addEventListener("mouseover", runAway);

    noBtn.addEventListener(
        "touchstart",
        runAway,
        { passive: true }
    );
}

function runAway() {
    const margin = 20;

    const buttonWidth = noBtn.offsetWidth;
    const buttonHeight = noBtn.offsetHeight;

    const maxX = Math.max(
        window.innerWidth - buttonWidth - margin,
        margin
    );

    const maxY = Math.max(
        window.innerHeight - buttonHeight - margin,
        margin
    );

    const randomX =
        Math.random() * (maxX - margin) + margin;

    const randomY =
        Math.random() * (maxY - margin) + margin;

    noBtn.style.position = "fixed";
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
    noBtn.style.zIndex = "50";
}
