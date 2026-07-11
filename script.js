function setRunningText() {
    var teks = document.getElementById("runningText");
    if (!teks) return;

    var hari = new Date().getDay();

    var teksHari = {
        0: "WELCOME,JIKA INGIN ORDER SILAKAN CEK HARGA YANG MAU DI BELI,LALU HUBUNGI ADMIN🤗",
        1:"WELCOME,JIKA INGIN ORDER SILAKAN CEK HARGA YANH MAU DI BELI DAN CHAT ADMIN🤗",
        2: "WELCOME,JIKA INGIN ORDER SILAKAN CEK HARGA YANH MAU DI BELI DAN CHAT ADMIN🤗",
        3: "WELCOME,JIKA INGIN ORDER SILAKAN CEK HARGA YANH MAU DI BELI DAN CHAT ADMIN🤗",
        4: "WELCOME,JIKA INGIN ORDER SILAKAN CEK HARGA YANH MAU DI BELI DAN CHAT ADMIN🤗",
        5: "PROMO JUMAT BERKAH ADA HARGA SPESIAL,SILAKAN HUBUNGI ADMIN UNTUK MENGETAHUI HARGA SPESIAL🔥",
        6: "WELCOME,JIKA INGIN ORDER SILAKAN CEK HARGA YANH MAU DI BELI DAN CHAT ADMIN🤗"
    };

    teks.textContent = teksHari[hari] || "WELCOME,JIKA INGIN ORDER SILAKAN CEK HARGA YANH MAU DI BELI DAN CHAT ADMIN🤗";
}

function bukaTestimoniModal(src) {
    var modal = document.getElementById("testimoniModal");
    var img = document.getElementById("testimoniModalImage");
    if (modal && img && src) {
        img.src = src;
        img.onerror = function() { this.style.display = 'none'; };
        modal.classList.add("active");
        document.body.style.overflow = 'hidden';
    }
}

function tutupTestimoniModal() {
    var modal = document.getElementById("testimoniModal");
    if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = '';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setRunningText();
    muatHarga();
    muatProduk();
    muatTestimoni();
    muatFAQ();
});

function muatHarga() {
    var container = document.getElementById("priceList");
    if (!container) return;

    var defaultHarga = [
        { name: "70JT UB + 30JT UB", value: "Rp 5.000", icon: "💵" },
        { name: "200JT UB + 20JT UB", value: "Rp 10.000", icon: "💵" },
        { name: "250JT UB + 20JT UB", value: "Rp 20.000", icon: "💵" },
        { name: "300JT UB + 30JT UB", value: "Rp 25.000", icon: "💵" },
        { name: "500JT UB + 50JT UB", value: "Rp 30.000", icon: "💵" },
        { name: "700JT UB + 50JT UB", value: "Rp 35.000", icon: "💵" },
        { name: "900JT UB + 50JT UB", value: "Rp 40.000", icon: "💵" },
        { name: "1M UB + 500JT UB", value: "Rp 45.000", icon: "💵" },
        { name: "2M UB + MAX UB", value: "Rp 50.000", icon: "💵" },
        { name: "PEMBERITAHUAN", value: "TOP UP VIA LOGIN FACEBOOK!", icon: "📢" }
    ];

    defaultHarga.forEach(function(item) {
        var li = document.createElement("li");
        li.innerHTML = '<span>' + item.icon + ' ' + item.name + '</span> <strong>' + item.value + '</strong>';
        container.appendChild(li);
    });
}

function muatProduk() {
    var container = document.getElementById("produkContainer");
    if (!container) return;

    var defaultProduk = [
        {
            name: "WEB TOP UP BUSSID",
            price: "Rp 20.000",
            description: "WEB TOP UP BUSSID<br>1 MINGGU 20K<br>2 MINGGU 35K<br>1 BULAN 45K<br>2 BULAN 50K<br>3 BULAN 65K<br>PERMANEN 100K<br><br>KEUNTUNGAN:<br>• BISA TOP UP IN TEMEN<br>• BISA BUKA JUALAN<br>• TOP UP SEPUASNYA",
            image: "produk1.jpg",
            features: ["TOP UP INSTAN", "KURAS INSTAN", "WEB TOP UP"],
            status: "tersedia",
            promo: "FOR SEWA",
            buttonText: "SEWA SEKARANG",
            whatsappNumber: "6285199120995",
            whatsappText: "Halo saya mau sewa WEB TOP UP BUSSID"
        },
        {
            name: "SC TOP UP BUSSID",
            price: "Rp 15.000",
            description: "SCRIPT TOP UP BUSSID<br>1 MINGGU 15K<br>2 MINGGU 25K<br>1 BULAN 35K<br>2 BULAN 40K<br>PERMANEN 80K",
            image: "produk2.jpg",
            features: ["TOP UP INSTAN", "KURAS INSTAN", "CUSTOM KURAS"],
            status: "tidak tersedia",
            promo: "CLOSE",
            buttonText: "Sewa Sekarang",
            whatsappNumber: "6285199120995",
            whatsappText: "Halo saya mau sewa SC TOP UP BUSSID"
        }
    ];

    defaultProduk.forEach(function(produk) {
        var card = document.createElement("div");
        card.className = "produk-card";

        var isAvailable = produk.status === "tersedia";
        var badgeHTML = produk.promo ? '<div class="produk-badge">' + produk.promo + '</div>' : '';
        var featuresHTML = '';
        if (produk.features) {
            featuresHTML = '<div class="produk-features">' + produk.features.map(function(f) { return '<span class="produk-feature">' + f + '</span>'; }).join('') + '</div>';
        }

        var whatsappMsg = produk.whatsappText || "Halo, saya ingin membeli {nama_produk} seharga {harga_produk}";
        whatsappMsg = whatsappMsg.replace(/{nama_produk}/g, produk.name).replace(/{harga_produk}/g, produk.price);
        var whatsappUrl = "https://wa.me/" + produk.whatsappNumber + "?text=" + encodeURIComponent(whatsappMsg);

        card.innerHTML = 
            badgeHTML +
            '<div class="produk-image-container">' +
                '<img src="' + produk.image + '" alt="' + produk.name + '" class="produk-image" onclick="openImageModal(\'' + produk.image + '\')" onerror="this.src=\'https://via.placeholder.com/300x180/00BFFF/FFFFFF?text=Gambar\'">' +
            '</div>' +
            '<div class="produk-info">' +
                '<div class="produk-title">' + produk.name + '</div>' +
                '<div class="produk-price">' + produk.price + '</div>' +
                featuresHTML +
                '<div class="produk-description-container">' +
                    '<div class="produk-description collapsed">' + produk.description + '</div>' +
                    '<button class="read-more-btn"><i class="fas fa-chevron-down"></i> Baca Selengkapnya</button>' +
                '</div>' +
                '<div class="produk-status ' + (isAvailable ? 'status-tersedia' : 'status-tidak-tersedia') + '">' + (isAvailable ? 'TERSEDIA' : 'TIDAK TERSEDIA') + '</div>' +
                (isAvailable ? 
                    '<a href="' + whatsappUrl + '" class="btn btn-whatsapp" target="_blank" rel="noopener" style="margin-top:0.5rem;"><i class="fab fa-whatsapp"></i> ' + (produk.buttonText || "Beli Sekarang") + '</a>' :
                    '<button class="btn btn-disabled" style="margin-top:0.5rem;" disabled><i class="fas fa-times-circle"></i> Tidak Tersedia</button>'
                ) +
            '</div>';

        container.appendChild(card);
    });

    if (typeof initReadMoreButtons === 'function') {
        setTimeout(initReadMoreButtons, 200);
    }
}

function muatTestimoni() {
    var container = document.getElementById("testimoniContainer");
    if (!container) return;
    
    var defaultTestimoni = [
        { nama: "Pembeli 1", gambar: "Img/1.jpg" },
        { nama: "Pembeli 2", gambar: "Img/2.jpg" },
        { nama: "Pembeli 3", gambar: "Img/3.jpg" },
        { nama: "Pembeli 4", gambar: "Img/4.jpg" },
        { nama: "Pembeli 5", gambar: "Img/5.jpg" },
        { nama: "Pembeli 6", gambar: "Img/6.jpg" },
        { nama: "Pembeli 7", gambar: "Img/7.jpg" },
        { nama: "Pembeli 8", gambar: "Img/8.jpg" },
        { nama: "Pembeli 9", gambar: "Img/9.jpg" },
        { nama: "Pembeli 10", gambar: "Img/10.jpg" },
        { nama: "Pembeli 11", gambar: "Img/11.jpg" },
        { nama: "Pembeli 12", gambar: "Img/12.jpg" },
        { nama: "Pembeli 13", gambar: "Img/13.jpg" },
        { nama: "Pembeli 14", gambar: "Img/14.jpg" },
        { nama: "Pembeli 15", gambar: "Img/15.jpg" },
        { nama: "Pembeli 16", gambar: "Img/16.jpg" },
        { nama: "Pembeli 17", gambar: "Img/17.jpg" },
        { nama: "Pembeli 18", gambar: "Img/18.jpg" },
        { nama: "Pembeli 19", gambar: "Img/19.jpg" },
        { nama: "Pembeli 20", gambar: "Img/20.jpg" },
        { nama: "Pembeli 21", gambar: "Img/21.jpg" },
        { nama: "Pembeli 22", gambar: "Img/22.jpg" },
        { nama: "Pembeli 23", gambar: "Img/23.jpg" },
        { nama: "Pembeli 24", gambar: "Img/24.jpg" },
        { nama: "Pembeli 25", gambar: "Img/25.jpg" }
    ];
    
    defaultTestimoni.forEach(function(item, index) {
        var card = document.createElement("div");
        card.className = "testimoni-card";
        
        var gambarHTML = '';
        if (item.gambar) {
            gambarHTML = '<img src="' + item.gambar + '" alt="Bukti" class="testimoni-image" onclick="bukaTestimoniModal(\'' + item.gambar + '\')" onerror="this.style.display=\'none\'">';
        }
        
        card.innerHTML =
            '<div class="testimoni-number">' + (index + 1) + '</div>' +
            gambarHTML +
            '<div class="testimoni-name">- ' + item.nama + '</div>';
        
        container.appendChild(card);
    });
}

function muatFAQ() {
    var container = document.getElementById("faqContainer");
    if (!container) return;

    var defaultFAQ = [
        { question: "Proses top up berapa menit?", answer: "Untuk proses top up memakan waktu sekitar 5-10 menit (Jika tidak ada kendala)" },
        { question: "Bisa tf lewat apa saja?", answer: "Kami menerima: QRIS (Semua e-wallet), Dana, OVO, Gopay. Untuk mobile banking bisa lewat QRIS" },
        { question: "Apakah ada garansi jika ub menghilang?", answer: "Untuk garansi kami jelas ada, kami memberikan garansi dalam kurun waktu 3 hari di luar itu garansi hangus dan ada syarat dan ketentuan berlaku. Jika ub hilang karena ulahmu sendiri itu tidak akan kami isi lagi tapi kalo memang menghilang sendiri padahal ga kenapa² bakal kami isi ulang!" },
        { question: "Sistem Top Up nya gimana min?", answer: "Untuk sistem top up nanti admin bakal login ke akun Google Play kalian yang udah tertaut ke bussid lalu admin akan login ke akun bussid kalian untuk top up akun kalian" },
        { question: "Aman ga sih min?, aku takut ke hack", answer: "Top up di Revan udah pasti aman ya soalnya udah banyak testimoni dan udah ngerjain ratusan akun" },
        { question: "Sehabis tf gimana min?", answer: "Setelah kalian tf kalian bisa kirim data akun fb (Facebook) yang tertaut ke bussid" },
        { question: "Admin nya slow respon", answer: "Sorry banget kalo admin slow respon karena admin juga manusia dan ada kegiatan seperti sekolah, sholat, dan juga makan. Kami berharap bisa membalas pesan anda secepat mungkin 🤗" },
        { question: "Sc top up bussid itu apa sih?", answer: "Sc (script) top up bussid adalah suatu tools untuk top up bussid, anda cukup membayar 15 Ribu untuk mendapatkan akses selama 1 minggu dengan keuntungan yang banyak 🤩" },
        { question: "Min kalo hp ip (ios) bisa top up ga?", answer: "Maaf untuk yang menggunakan hp ip (ios) belum bisa dikarenakan admin pake hp Android." },
        { question: "Bisa bayar pake pulsa ga min?", answer: "Mohon maaf untuk pembayaran melalui pulsa tidak bisa, kami hanya menerima pembayaran melalui e-wallet dan Mobile banking (lewat QRIS)" }
    ];

    defaultFAQ.forEach(function(faq) {
        var item = document.createElement("div");
        item.className = "accordion-item";
        item.innerHTML = '<button class="accordion-button">' + faq.question + '</button><div class="accordion-content"><p>' + faq.answer + '</p></div>';
        container.appendChild(item);
    });

    pasangAccordion();
}

function pasangAccordion() {
    document.querySelectorAll('.accordion-button').forEach(function(button) {
        button.removeEventListener('click', accordionHandler);
        button.addEventListener('click', accordionHandler);
    });
}

function accordionHandler() {
    this.classList.toggle('active');
    var content = this.nextElementSibling;
    if (content) {
        content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + 'px';
    }
}