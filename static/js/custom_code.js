const images = [
    "static/img/photos/empresa1.jpg",  // Primera imagen
    "static/img/photos/empresa2.jpg",  // Segunda imagen
    "static/img/photos/empresa3.jpg",  // Tercera imagen
    "static/img/photos/empresa4.jpg"   // Cuarta imagen
];

let currentImageIndex = 0;
const carouselDiv = document.getElementById('background-carousel');

// Crear elementos div para cada imagen de fondo
images.forEach((imgUrl, index) => {
    const imgDiv = document.createElement('div');
    imgDiv.classList.add('background-image');
    imgDiv.style.backgroundImage = `url('${imgUrl}')`;
    if (index === 0) {
        imgDiv.classList.add('active');
    }
    carouselDiv.appendChild(imgDiv);
});

const backgroundImages = document.querySelectorAll('.background-image');

function changeBackgroundImage() {
    const currentImage = backgroundImages[currentImageIndex];
    currentImage.classList.remove('active');
    currentImage.classList.add('previous');

    // Cambiar al siguiente índice
    currentImageIndex = (currentImageIndex + 1) % images.length;
    const nextImage = backgroundImages[currentImageIndex];
    nextImage.classList.remove('previous');
    nextImage.classList.add('active');
}

// Cambiar la imagen cada 4 segundos
setInterval(changeBackgroundImage, 4000);