document.addEventListener('DOMContentLoaded', () => {
    alert('JS loaded');

    const notification = document.getElementById('notification');
    const newsItems = document.querySelectorAll('.news-item');
    const saveButton = document.querySelector('.btn-secondary[data-action="save"]');
    const updateButton = document.querySelector('.btn-primary[data-action="update"]');
    const quickSaveButton = document.querySelector('.floating-save');
    const toolItems = document.querySelectorAll('.tool-item');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const designTools = document.getElementById('design-tools');
    const videoPreview = document.querySelector('.video-preview');
    let canvas = null;
    let quillTitle = null; // Quill untuk judul
    let quillDescription = null; // Quill untuk deskripsi

    // Pengecekan jumlah tool
    alert('Tools found: ' + toolItems.length);

    // Inisialisasi Quill untuk Judul
    if (document.getElementById('news-tab')) {
        try {
            quillTitle = new Quill('#title-editor', {
                theme: 'snow',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline'],
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        [{ 'color': [] }, { 'background': [] }],
                        ['link']
                    ]
                },
                placeholder: 'Masukkan judul berita resmi...'
            });
            alert('Quill title initialized');
        } catch (error) {
            alert('Quill title initialization failed: ' + error.message);
        }
    }

    // Inisialisasi Quill untuk Deskripsi
    if (document.getElementById('news-tab')) {
        try {
            quillDescription = new Quill('#quill-editor', {
                theme: 'snow',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline'],
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        [{ 'color': [] }, { 'background': [] }],
                        ['image', 'video', 'link']
                    ]
                },
                placeholder: 'Masukkan deskripsi lengkap berita...'
            });
            alert('Quill description initialized');
        } catch (error) {
            alert('Quill description initialization failed: ' + error.message);
        }
    }

    // Inisialisasi Fabric.js
    function initCanvas() {
        try {
            canvas = new fabric.Canvas('designCanvas', {
                width: 800,
                height: 600,
                backgroundColor: '#fff',
            });
            alert('Canvas initialized');
        } catch (error) {
            alert('Canvas initialization failed: ' + error.message);
        }
    }

    // Fungsi untuk menampilkan notifikasi
    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Fungsi untuk editor desain
    function addTextToCanvas(fontSize = 20, color = '#000') {
        if (!canvas) return;
        const text = new fabric.Textbox('Teks Baru', {
            left: 50,
            top: 50,
            width: 200,
            fontSize: fontSize,
            fill: color,
            editable: true,
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
        showNotification('Teks ditambahkan ke kanvas');
    }

    function addRectToCanvas() {
        if (!canvas) return;
        const rect = new fabric.Rect({
            left: 50,
            top: 50,
            width: 100,
            height: 50,
            fill: '#3498db',
            stroke: '#000',
            strokeWidth: 1,
        });
        canvas.add(rect);
        canvas.setActiveObject(rect);
        canvas.renderAll();
        showNotification('Persegi ditambahkan ke kanvas');
    }

    function addImageToCanvas(e) {
        if (!canvas) return;
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                fabric.Image.fromURL(event.target.result, (img) => {
                    img.scale(0.5);
                    img.set({ left: 50, top: 50 });
                    canvas.add(img);
                    canvas.setActiveObject(img);
                    canvas.renderAll();
                    showNotification('Gambar ditambahkan ke kanvas');
                });
            };
            reader.readAsDataURL(file);
        }
    }

    // Event listener untuk tab
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert('Tab clicked: ' + button.getAttribute('data-tab'));
            const tab = button.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            tabContents.forEach(content => content.style.display = 'none');
            document.getElementById(`${tab}-tab`).style.display = 'block';
            designTools.style.display = tab === 'design' ? 'block' : 'none';
            if (tab === 'design' && !canvas) {
                initCanvas();
            }
            showNotification(`Beralih ke ${tab === 'news' ? 'Editor Berita' : 'Editor Desain'}`);
        });
    });

    // Event listener untuk tool-item
    toolItems.forEach(item => {
        item.addEventListener('click', () => {
            alert('Tool clicked: ' + item.getAttribute('data-tool'));
            const tool = item.getAttribute('data-tool');
            const isDesignTab = document.getElementById('design-tab').style.display !== 'none';
            const titleSelection = quillTitle ? quillTitle.getSelection() : null;
            const descSelection = quillDescription ? quillDescription.getSelection() : null;

            if (!isDesignTab && (quillTitle || quillDescription)) {
                // Terapkan format ke editor yang aktif (judul atau deskripsi)
                const activeQuill = titleSelection ? quillTitle : quillDescription;
                const selection = titleSelection || descSelection;
                switch (tool) {
                    case 'bold':
                        activeQuill.format('bold', !selection || !selection.length ? true : null);
                        showNotification('Teks ditebalkan');
                        break;
                    case 'italic':
                        activeQuill.format('italic', !selection || !selection.length ? true : null);
                        showNotification('Teks dimiringkan');
                        break;
                    case 'underline':
                        activeQuill.format('underline', !selection || !selection.length ? true : null);
                        showNotification('Teks digarisbawahi');
                        break;
                    case 'align-left':
                        activeQuill.format('align', 'left');
                        showNotification('Teks dirata kiri');
                        break;
                    case 'align-center':
                        activeQuill.format('align', 'center');
                        showNotification('Teks dirata tengah');
                        break;
                    case 'align-right':
                        activeQuill.format('align', 'right');
                        showNotification('Teks dirata kanan');
                        break;
                    case 'list':
                        activeQuill.format('list', 'bullet');
                        showNotification('Daftar berpoin ditambahkan');
                        break;
                    case 'table':
                        activeQuill.insertText(selection ? selection.index : 0, 'Tabel belum didukung penuh');
                        showNotification('Fitur tabel belum lengkap');
                        break;
                    case 'link':
                        const url = prompt('Masukkan URL tautan:');
                        if (url) {
                            activeQuill.format('link', url);
                            showNotification('Tautan ditambahkan');
                        }
                        break;
                    case 'font-size':
                        const size = prompt('Masukkan ukuran font (misalnya, 16px):');
                        if (size) {
                            activeQuill.format('size', size);
                            showNotification(`Ukuran font diubah ke ${size}`);
                        }
                        break;
                    case 'color':
                        const color = prompt('Masukkan kode warna (misalnya, #ff0000):');
                        if (color) {
                            activeQuill.format('color', color);
                            showNotification('Warna teks diubah');
                        }
                        break;
                    case 'highlight':
                        const bgColor = prompt('Masukkan kode warna sorotan (misalnya, #ffff00):');
                        if (bgColor) {
                            activeQuill.format('background', bgColor);
                            showNotification('Sorotan ditambahkan');
                        }
                        break;
                    case 'image':
                        if (activeQuill === quillDescription) { // Hanya izinkan gambar di deskripsi
                            const inputImage = document.createElement('input');
                            inputImage.type = 'file';
                            inputImage.accept = 'image/*';
                            inputImage.onchange = (e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                        const range = activeQuill.getSelection();
                                        activeQuill.insertEmbed(range.index, 'image', event.target.result);
                                        showNotification('Gambar disisipkan');
                                    };
                                    reader.readAsDataURL(file);
                                }
                            };
                            inputImage.click();
                        } else {
                            showNotification('Gambar tidak didukung di judul berita');
                        }
                        break;
                    case 'video':
                        if (activeQuill === quillDescription) { // Hanya izinkan video di deskripsi
                            const videoUrl = prompt('Masukkan URL video (misalnya, YouTube embed):');
                            if (videoUrl) {
                                activeQuill.insertText(selection ? selection.index : 0, videoUrl);
                                showNotification('URL video disisipkan');
                            }
                        } else {
                            showNotification('Video tidak didukung di judul berita');
                        }
                        break;
                    case 'document':
                        const docUrl = prompt('Masukkan URL dokumen (misalnya, link PDF):');
                        if (docUrl) {
                            activeQuill.format('link', docUrl);
                            showNotification('Dokumen ditambahkan sebagai tautan');
                        }
                        break;
                    default:
                        showNotification('Fitur ini belum diimplementasikan');
                }
            } else if (canvas) {
                switch (tool) {
                    case 'add-text':
                        addTextToCanvas();
                        break;
                    case 'add-rect':
                        addRectToCanvas();
                        break;
                    case 'add-image':
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = addImageToCanvas;
                        input.click();
                        break;
                    case 'font-size':
                        const fontSize = prompt('Masukkan ukuran font (misalnya, 20):');
                        if (fontSize && canvas.getActiveObject() && canvas.getActiveObject().type === 'textbox') {
                            canvas.getActiveObject().set('fontSize', parseInt(fontSize));
                            canvas.renderAll();
                            showNotification(`Ukuran font diubah ke ${fontSize}`);
                        } else {
                            showNotification('Pilih teks terlebih dahulu');
                        }
                        break;
                    case 'color':
                        const color = prompt('Masukkan kode warna (misalnya, #ff0000):');
                        if (color && canvas.getActiveObject() && canvas.getActiveObject().type === 'textbox') {
                            canvas.getActiveObject().set('fill', color);
                            canvas.renderAll();
                            showNotification('Warna teks diubah');
                        } else {
                            showNotification('Pilih teks terlebih dahulu');
                        }
                        break;
                    default:
                        showNotification('Fitur desain ini belum diimplementasikan');
                }
            }
        });
    });

    // Event listener untuk news-item
    newsItems.forEach(item => {
        item.addEventListener('click', () => {
            const title = item.getAttribute('data-title');
            const date = item.querySelector('.news-date').textContent.replace('📅 ', '');
            if (quillTitle) quillTitle.setText(title);
            document.getElementById('date').value = date;
            if (quillDescription) quillDescription.setText(`Deskripsi untuk ${title}`);
            showNotification('Berita dimuat ke form');
        });
    });

    // Event listener untuk tombol simpan
    saveButton.addEventListener('click', () => {
        const title = quillTitle ? quillTitle.getText().trim() : '';
        if (title && quillDescription) {
            showNotification('Draft berita disimpan');
            alert('Draft saved: ' + JSON.stringify({
                title: title,
                description: quillDescription.getText(),
                date: document.getElementById('date').value
            }));
        } else {
            showNotification('Judul berita harus diisi');
        }
    });

    // Event listener untuk tombol update
    updateButton.addEventListener('click', () => {
        showNotification('Berita diperbarui');
        alert('Berita diperbarui');
    });

    // Event listener untuk floating save
    quickSaveButton.addEventListener('click', () => {
        if (document.getElementById('design-tab').style.display !== 'none' && canvas) {
            const json = JSON.stringify(canvas.toJSON());
            showNotification('Desain disimpan cepat');
            alert('Desain saved: ' + json);
        } else if (quillTitle && quillDescription) {
            showNotification('Simpan cepat berita');
            alert('Draft saved: ' + JSON.stringify({
                title: quillTitle.getText().trim(),
                description: quillDescription.getText(),
                date: document.getElementById('date').value
            }));
        }
    });
});
