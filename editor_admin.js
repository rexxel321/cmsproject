document.addEventListener('DOMContentLoaded', function() {
    const title = localStorage.getItem('newsTitle');
    const description = localStorage.getItem('newsDescription');
    const date = localStorage.getItem('newsDate');

    if (title) document.getElementById('title').value = title;
    if (description) document.getElementById('description').value = description;
    if (date) document.getElementById('date').value = date;

    localStorage.removeItem('newsTitle');
    localStorage.removeItem('newsDescription');
    localStorage.removeItem('newsDate');

    startAutoSave();
    
    setTimeout(() => {
        showNotification('🏛️ Selamat datang di CMS Diskominfotik Kabupaten Bekasi!');
    }, 1000);
    
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

document.querySelectorAll('.news-item').forEach(item => {
    item.addEventListener('click', function() {
        const title = this.getAttribute('data-title');
        document.getElementById('title').value = title;
        showNotification('✅ Berita dipilih: ' + title);
    });
});

document.querySelectorAll('.tool-item').forEach(item => {
    item.addEventListener('click', function() {
        const tool = this.getAttribute('data-tool');
        const activeElement = document.activeElement;
        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
            showNotification('🛠️ Tool "' + tool + '" diterapkan');
        } else {
            showNotification('⚠️ Pilih text field terlebih dahulu');
        }
    });
});

document.querySelectorAll('button[data-action]').forEach(button => {
    button.addEventListener('click', function() {
        const action = this.getAttribute('data-action');
        switch (action) {
            case 'update':
                updateContent();
                break;
            case 'save':
                saveContent();
                break;
            case 'quickSave':
                quickSave();
                break;
        }
    });
});

document.querySelector('.play-button').addEventListener('click', playVideo);

function updateContent() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;

    if (title && description && date) {
        showNotification('✅ Konten berita berhasil diperbarui!');
    } else {
        showNotification('⚠️ Harap lengkapi semua field yang diperlukan');
    }
}

function saveContent() {
    const title = document.getElementById('title').value;
    if (title) {
        showNotification('💾 Draft berita berhasil disimpan!');
    } else {
        showNotification('⚠️ Harap isi judul berita terlebih dahulu');
    }
}

function quickSave() {
    showNotification('⚡ Quick save berhasil!');
}

function playVideo() {
    showNotification('📹 Video player akan dimuat...');
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

let autoSaveInterval;
function startAutoSave() {
    autoSaveInterval = setInterval(() => {
        const title = document.getElementById('title').value;
        if (title) {
            showNotification('💾 Auto-save aktif...');
        }
    }, 60000);
}