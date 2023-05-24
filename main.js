/* SPEECH TO TEXT */

let responseField = document.querySelector(".response");

if (! "webkitSpeechRecognition" in window) {
    alert("Speech Recognition Not Available")
}

if (! "speechSynthesis" in window) {
    alert("Speech Synth not Supported")
}

let synth = window.speechSynthesis;

// Variabel untuk menyimpan hasil konversi speech to text dan nilai confidence
let res;
let conf;

// Inisialisasi Speech Recognition
const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// Lakukan konfigurasi
recognition.continuous = false;
recognition.lang = "en";
recognition.interimResults = false;

// Saat start, ubah status menjadi listening
recognition.onstart = () => {
    document.querySelector("#status").innerHTML ="Listening...";
}

// Saat selesai, ubah status menjadi stopped
recognition.onspeechend = () => {
    document.querySelector("#status").innerHTML ="Stopped";
    recognition.stop();
}

// Munculkan hasil konversi dan nilai confidence
recognition.addEventListener("result", async(e) => {
    let res = e.results[0][0].transcript;
    let conf = e.results[0][0].confidence;
    document.querySelector("#result").innerHTML = res;
    document.querySelector("#confidence").innerHTML = conf;
    console.log(res);
    await fetch("http://192.168.43.153:5000/process", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "speech": res
            }),
        }
    )
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let utterance = new SpeechSynthesisUtterance(data['response']);
        responseField.innerHTML = data['response']

        // Konfigurasi
        utterance.lang = 'en-EN';

        synth.speak(utterance);
    })
})

// Munculkan pesan error jika error
recognition.onError = () => {
    console.log("Error!");
}

// Mulai konversi speech to text apabila tombol start ditekan
document.querySelector("#start").onclick = () => {
    recognition.start();
}

/* TEXT TO SPEECH */

// if (! "speechSynthesis" in window) {
//     alert("Speech Synth not Supported")
// }

// let synth = window.speechSynthesis;

// function speak() {
//     // Siapkan kata-kata yang ingin diucapkan
//     let text = document.querySelector('#text').value;
//     let utterance = new SpeechSynthesisUtterance(text);

//     // Konfigurasi
//     utterance.lang = 'en-EN';
//     utterance.pitch = document.querySelector('#pitch').value;
//     utterance.rate = document.querySelector('#rate').value;

//     // Pengucapan kata-kata
//     synth.speak(utterance);
// }