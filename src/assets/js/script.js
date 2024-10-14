// // Khởi tạo đối tượng MINIGAME nếu nó chưa tồn tại
// var MINIGAME = MINIGAME || {};

// // Đảm bảo mã sẽ chạy khi toàn bộ tài liệu HTML đã được tải xong
// $(document).ready(function () {
//     console.log("Document is ready"); // Debugging: Check if this runs

//     // Tạo một phiên bản mới của trò chơi
//     const playgame = new playGame();
//     $('.main-bottom-content > *').not('.home-page').css("display", "none");
//     $('.home-page h1').css("display", "flex");
//     // Đăng ký sự kiện 'dataLoaded' trên đối tượng document
//     $(document).on('dataLoaded', function (event, data) {
//         // Duyệt qua danh sách sản phẩm trong playgame
//         $.each(playgame.listProducts, (index, product) => {
//             // Tạo một thẻ HTML cho mỗi sản phẩm
//             const productCard = `
//                 <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-6 product-list-content">
//                     <div class="product-card">
//                         <img src="${product.url}" alt="${product.title}" class="product-card-img" />
//                         <div class="number-correct">
//                             <span>x</span>
//                             <span>0</span>
//                         </div>
//                         <span class="product-card-name">${product.title}</span>
//                     </div>
//                 </div>
//             `;

//             // Thêm thẻ sản phẩm vừa tạo vào danh sách sản phẩm trong HTML

//             $(".product-card-list").append(productCard);
//         });

//         // Duyệt qua danh sách nhân vật trong playgame
//         $.each(playgame.listCharacters, (index, character) => {
//             // Tạo một thẻ HTML cho mỗi nhân vật
//             const characterCard = `
//                 <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-6 character-list-content">
//                     <img
//                         src="${character.url}"
//                         alt="character-${index + 1}-card"
//                         class="character-card character-${index + 1}-card"
//                     />
//                     <img
//                         src="${character.activeUrl}"
//                         alt="character-${index + 1}-card-active"
//                         class="character-card character-${index + 1}-card-active"
//                     />
//                     <div class="name-correct">
//                         <span class="name-correct-number"></span>
//                         <span class="name-correct-desc"></span>
//                     </div>
//                 </div>
//             `;
//             // Thêm thẻ nhân vật vừa tạo vào danh sách nhân vật trong HTML
//             $(".character-card-list").append(characterCard);
//         });
//     });

//     // Đặt thuộc tính src và volume cho phần tử âm thanh nền
//     $(".audio-background")
//         .attr("src", playgame.gameSound.audioBackground)  // Đặt đường dẫn tới âm thanh nền
//         .prop("volume", playgame.gameSound.maxVolumn);    // Đặt mức âm lượng tối đa

//     // Đặt thuộc tính src cho âm thanh thất bại
//     $(".audio-fail").attr("src", playgame.gameSound.audioFail);

//     // Đặt chiều rộng cho thanh thời gian dựa trên thời gian còn lại của trò chơi
//     $(".timer-range").css("width", playgame.gameTime.timeRemainder + "%");

//     // Gọi các hàm xử lý trang và trò chơi
//     MINIGAME.handleConvertsPage(playgame);
//     MINIGAME.handlePlayGame(playgame);
// });

// // Hàm xử lý chuyển đổi trang
// MINIGAME.handleConvertsPage = (playgame) => {

//     // Khi người dùng nhấn vào logo
//     $('.takashimaya-header-logo').on('click', function (e) {
//         // Ẩn tất cả các phần tử con của .main-bottom-content ngoại trừ .home-page
//         $('.main-bottom-content > *').not('.home-page').css("display", "none");
//         // Hiển thị .home-page
//         $('.home-page').css("display", "flex");
//     });

//     // Khi người dùng nhấn vào liên kết để chuyển đến trang chơi
//     $('.nav-link[href="#play-page"]').on('click', function (e) {
//         e.preventDefault();
//         $('.game-content').not('.header-site').each(function() {
//             $(this).css('pointer-events', ''); // Xóa thuộc tính pointer-events để bật lại sự kiện click
        
//             $(this).addClass('active'); // Thêm class active vào các phần tử không có class .header-site
//         });
        
//          // Ẩn thẻ h1 của class home-page
//          $('.home-page h1').css("display", "none");
//         // playgame.playSoundBackground();
//         // Ẩn tất cả các phần tử con của .main-bottom-content ngoại trừ .main-bottom-content-row
//         $('.main-bottom-content > *').not('.main-bottom-content-row').css("display", "none");
//         // Hiển thị .main-bottom-content-row
//         $('.main-bottom-content-row').css("display", "block");
//         // Ẩn nội dung trò chơi
//         $('.game-content').css("display", "none");

//         // Tải nội dung từ count-down.html và hiển thị
//         $('#count-down').load('./view/count-down.html', function () {
//             // Hiển thị modal đếm ngược sau khi tải
//             $('#count-down').css("display", "block");
//             // Hiển thị modal đếm ngược của trò chơi
//             playgame.showCountdownModal();
            
//         });
//     });
// };

// // Hàm xử lý trò chơi
// MINIGAME.handlePlayGame = (playgame) => {
//     // Khi sự kiện 'dataLoaded' xảy ra
//     $(document).on('dataLoaded', () => {
//         // Hiển thị tên ngẫu nhiên đúng
//         playgame.showRandomNameCorrect();
//         // Lấy câu trả lời
//         playgame.getAnswer();
//     });
// }

// // Hàm cuộn tới phần tử ngẫu nhiên trong danh sách nhân vật
// MINIGAME.scrollToRandomElement = (randomNumber) => {
//     // Lấy phần tử ngẫu nhiên dựa trên chỉ số
//     const element = $(`.character-card-list > div:nth-child(${randomNumber})`)[0];
//     if (element) {
//         // Cuộn tới phần tử ngẫu nhiên với hiệu ứng mượt
//         element.scrollIntoView({
//             behavior: "smooth",
//             inline: "center",
//         });
//     }
// };