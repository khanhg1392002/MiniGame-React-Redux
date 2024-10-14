
// const audioAssetsPath = "assets/music/";
// const viewAssetsPath = "view/";

// class playGame {
//     constructor() {
//         // Khởi tạo dữ liệu game
//         this.initGameData();
//         // Tải dữ liệu từ JSON
//         this.loadData();
//         // Khởi tạo các biến game
//         this.initGameVariables();
//     }

//     // Khởi tạo dữ liệu game
//     initGameData() {
//         this.listProducts = []; 
//         this.listCharacters = []; 
//         this.listProductNames = []; 
//         this.levels = [];
//         this.timeStepPercentage = [];
//     }

//     // Tải dữ liệu từ file JSON
//     loadData() {
//         $.getJSON('assets/data.json', (data) => {
//             // Xử lý dữ liệu sau khi tải
//             this.processData(data);
//             // Kích hoạt sự kiện 'dataLoaded' khi dữ liệu đã được tải
//             $(document).trigger('dataLoaded', {
//                 products: this.listProducts,
//                 characters: this.listCharacters,
//                 listName: this.listProductNames,
//                 timeStepPercentage: this.timeStepPercentage,
//                 levels: this.levels
//             });
//         })
//             .fail((jqXHR, textStatus, errorThrown) => {
//                 console.error('Error fetching data:', errorThrown); // Báo lỗi nếu có lỗi khi tải dữ liệu
//             });
//     }

//     // Xử lý dữ liệu sau khi tải
//     processData(data) {
//         const productsAssetsPath = data.productsAssetsPath;
//         const charactersAssetsPath = data.charactersAssetsPath;

//         if (data && data.products && Array.isArray(data.products)) {
//             this.listProducts = data.products.map(product => ({
//                 ...product,
//                 url: productsAssetsPath + product.url
//             }));
//             this.listProductNames = this.listProducts.map(product => product.title.toLowerCase());
//         } else {
//             console.error('Invalid product data format');
//         }

//         if (data && data.characters && Array.isArray(data.characters)) {
//             this.listCharacters = data.characters.map(character => ({
//                 ...character,
//                 url: charactersAssetsPath + character.url,
//                 activeUrl: charactersAssetsPath + character.activeUrl
//             }));
//         } else {
//             console.error('Invalid character data format');
//         }
//         if (data && data.levels && Array.isArray(data.levels)) {
//             this.levels = data.levels;
//         } else {
//             console.error('Invalid levels data format');
//         }
//     }

//     // Khởi tạo các biến game
//     initGameVariables() {
//         this.initTimeRemainder = 100;
//         this.playTimes = 5;
//         this.requiredNumberProducts = 0;
//         this.maxRequiredProducts = 5;
//         this.answerDone = false;
//         this.timeStepDenominator = 10;

//         this.gameTime = {
//             timerInterval: null,
//             timeRemainder: this.initTimeRemainder,
//             timeStep: this.initTimeRemainder / 10,
//         };

//         this.gameSound = {
//             audioBackground: audioAssetsPath + "bg_sound.mp3", // Âm thanh nền
//             audioFail: audioAssetsPath + "wrong.mp3", // Âm thanh khi chọn sai
//             maxVolume: 1,
//             audioRatio: 1,
//         };
//     }

//     // Lấy ngẫu nhiên tên sản phẩm đúng
//     getRandomNameCorrect() {
//         const randomIndex = Math.floor(Math.random() * this.listProductNames.length);
//         return this.listProductNames[randomIndex];
//     }

//     // Hiển thị modal đếm ngược
//     showCountdownModal() {
//         const getCountDownModalText = $('.modal-count-down h1');
//         const initCountDownTime = 3;
//         getCountDownModalText.text(initCountDownTime);
//         let countDownTime = initCountDownTime;

//         const intervalId = setInterval(() => {
//             countDownTime -= 1;
//             getCountDownModalText.text(countDownTime.toString());
//             if (countDownTime === 0) {
//                 clearInterval(intervalId);
//                 $('.modal-count-down').hide(() => {
//                     // Sau khi modal-count-down ẩn đi mới hiển thị game-content
//                     $('.game-content').css("display", "flex");
//                     this.showCountdownTime();
//                 });
//             }
//         }, 1000);
//     }

//     // Hiển thị tên sản phẩm đúng ngẫu nhiên
//     showRandomNameCorrect() {
//         const nameCorrectElements = $('.name-correct');
//         nameCorrectElements.css('display', 'none');

//         const randomIndex = Math.floor(Math.random() * nameCorrectElements.length);
//         const maxRequiredProducts = this.maxRequiredProducts;
//         nameCorrectElements.eq(randomIndex).css('display', 'block');

//         // Hiển thị hình ảnh tương ứng với tên sản phẩm đúng
//         $.each($('.character-card-list > div img:first-child'), (i, item) => {
//             $(item).css('display', i === randomIndex ? 'none' : 'block');
//         });

//         $.each($('.character-card-list > div img:nth-child(2)'), (i, item) => {
//             $(item).css('display', i === randomIndex ? 'block' : 'none');
//         });

//         const numberCorrect = nameCorrectElements.eq(randomIndex).find(".name-correct-number");
//         const descCorrect = nameCorrectElements.eq(randomIndex).find(".name-correct-desc");

//         // Đặt số lượng tên sản phẩm cần chọn và mô tả sản phẩm đúng
//         const randomNumber = Math.floor(Math.random() * this.maxRequiredProducts) + 1;
//         numberCorrect.text(randomNumber);
//         this.requiredNumberProducts = randomNumber;

//         const randomDesc = this.getRandomNameCorrect();
//         descCorrect.text(randomDesc);
//     }

//     // Lấy phản hồi khi người chơi chọn
//     getAnswer() {
//         $('.product-card').off('click').on('click', (event) => {
//             const productCard = $(event.currentTarget);
//             const requireProduct = $('.name-correct-desc').text();
//             const productTitle = productCard.find('.product-card-name').text().toLowerCase();

//             // Xử lý khi người chơi chọn đúng hoặc sai
//             if (productTitle === requireProduct) {
//                 this.handleCorrectAnswer(productCard);
//             } else {
//                 this.handleIncorrectAnswer();
//             }
//         });
//     }

//     // Xử lý khi người chơi chọn đúng
//     handleCorrectAnswer(productCard) {
//         // Tăng số lượng sản phẩm đúng đã chọn và hiển thị lên giao diện
//         const numberCorrectElement = productCard.find('.number-correct span:last-child');
//         const newValue = Number(numberCorrectElement.text()) + 1;
//         numberCorrectElement.text(newValue);
//         productCard.find('.number-correct').css("display", "flex");

//         // Kiểm tra nếu người chơi chọn quá số lượng yêu cầu
//         if (newValue > this.requiredNumberProducts) {
//             console.log('You choosed over quantity!');
//             this.showGameOver(); // Hiển thị màn hình kết thúc game
//         } else if (newValue === this.requiredNumberProducts) {
//             console.log('You choosed correct');
//             setTimeout(() => {
//                 this.resetAnswer(); // Đặt lại câu trả lời và chuẩn bị cho câu hỏi tiếp theo
//                 this.showRandomNameCorrect(); // Hiển thị tên sản phẩm đúng ngẫu nhiên mới
//                 this.showScoreCalculator(); // Cập nhật điểm số của người chơi
//                 this.getAnswer(); // Lấy phản hồi từ người chơi cho câu hỏi mới
//                 this.showCountdownTime(); // Hiển thị thanh đếm ngược
//             }, 300);
//         }
//     }


//     // Xử lý khi người chơi chọn sai
//     handleIncorrectAnswer() {
//         console.log('You choosed incorrect!');
//         $(".audio-background").get(0).pause(); // Tạm dừng âm thanh nền
//         this.showGameOver();
//         this.playSoundGameOver();
//     }

//     // Đặt lại câu trả lời
//     resetAnswer() {
//         $('.number-correct span:last-child').text('0');
//         $('.name-correct-desc').text('');
//         $('.number-correct').css('display', 'none');
//         clearInterval(this.gameTime.timerInterval);
//         this.gameTime.timeRemainder = this.initTimeRemainder;
//         $(".timer-range").css("width", this.gameTime.timeRemainder + "%");
//     }

//     // Hiển thị bảng tính điểm
//     showScoreCalculator() {
//         // Lấy phần tử hiển thị điểm số hiện tại
//         const currentScoreElement = $('.current-score');
//         // Lấy giá trị điểm số hiện tại từ phần tử, nếu không có thì mặc định là 0
//         let currentScore = parseInt(currentScoreElement.text(), 10) || 0;
//         // Tăng điểm số hiện tại lên 1 đơn vị
//         currentScore++;
//         // Hiển thị điểm số mới lên giao diện
//         currentScoreElement.text(currentScore);
//         // Cập nhật cấp độ game sau khi tăng điểm
//         this.updateGameLevel();
//     }

//     // Cập nhật cấp độ game
//     updateGameLevel() {
//         // Lấy điểm số hiện tại từ phần tử DOM
//         const currentScore = parseInt($('.current-score').text());
//         // Lấy phần tử hiển thị cấp độ từ DOM
//         const levelElement = $('#level');
//         // Lấy giá trị cấp độ hiện tại từ phần tử DOM
//         let currentLevel = parseInt(levelElement.text());

//         // Kiểm tra nếu điểm số chia hết cho 3 và lớn hơn 0
//         if (currentScore % 3 === 0 && currentScore > 0) {
//             // Tăng cấp độ hiện tại lên 1
//             currentLevel++;
//             // Hiển thị cấp độ mới lên giao diện
//             levelElement.text(currentLevel);

//             // Cập nhật timeStepDenominator từ levels
//             const levelData = this.levels.find(level => level.level === currentLevel);
//             if (levelData) {
//                 this.timeStepDenominator = levelData.timeStepPercentage;
//                 this.gameTime.timeStep = this.initTimeRemainder / (100 / this.timeStepDenominator);
//             }

//             // Tăng tốc độ phát âm thanh nền
//             this.gameSound.audioRatio += 0.1;
//             // Đặt lại tốc độ phát âm thanh nền mới
//             this.playbackRateAudioBackground(this.gameSound.audioRatio);
//         }
//     }

//     // Hiển thị thanh đếm ngược
//     showCountdownTime() {
//         let timeRemainder = this.initTimeRemainder;
//         const timeStep = this.gameTime.timeStep;
//         const rangeBar = $('.timer-range');
//         rangeBar.css("width", timeRemainder + "%");

//         this.gameTime.timerInterval = setInterval(() => {
//             timeRemainder -= timeStep;
//             rangeBar.css("width", timeRemainder + "%");
//             if (timeRemainder <= 0) {
//                 clearInterval(this.gameTime.timerInterval);
//                 this.showGameOver();
//                 this.playSoundGameOver();
//             }
//         }, 1000);
//     }


//     // Hiển thị màn hình kết thúc game
//     showGameOver() {
//         clearInterval(this.gameTime.timerInterval);
//         $('.false-clicked-modal').css("display", "flex");

//         setTimeout(() => {
//             this.showResultGame();
//         }, 3000);
//     }

//     // clearGame() {
//     //     // Đặt lại điểm số về 0
//     //     $('.current-score').text('0');
    
//     //     // Đặt lại thời gian bắt đầu về giá trị ban đầu
//     //     this.gameTime.timeRemainder = this.initTimeRemainder;
//     //     $(".timer-range").css("width", this.gameTime.timeRemainder + "%");
//     // }
    
    

//     // Hiển thị kết quả cuối cùng của game
//     showResultGame() {
//         $('.false-clicked-modal').css("display", "none");
//         $('#result-game').load('./view/result-game.html', () => {
//             const setScoreTotal = $('.final-score-text');
//             const getCurrentScore = $('.current-score');
//             const score = getCurrentScore.text();
//             setScoreTotal.text(score);

//             // Sự kiện nút chơi lại game
//             $('.restart-game-text').on('click', () => {
//                 $('.modal-result-game').hide(() => {
//                     // Ẩn modal kết quả game
                    
//                     // $('#count-down').load('/view/count-down.html', () => {
//                     // $('.game-content').css("display", "none");
//                     //     // Load lại phần nội dung của modal đếm ngược
//                     //     $('#count-down').css("display", "block");
//                     //     const game = new playGame(); // Tạo lại đối tượng game
//                     //     game.showCountdownModal(); // Hiển thị modal đếm ngược
                        
//                     // });
//                     location.reload();
//                 });
                
//                 // this.clearGame();
//             });

//             // Sự kiện nút đóng màn hình kết quả
// $('.result-game-button-close').on('click', () => {
//     // Ẩn modal kết quả game
//     $('.modal-result-game').hide();
    
//     // Khóa tất cả các action links trừ các liên kết có class "header-site"
//     // $('.game-content').not('.header-site').each(function() {
//     //     $(this).css('pointer-events', 'none'); // Vô hiệu hóa sự kiện click
//     //     $(this).addClass('disabled-link'); // Thêm class để hiển thị trạng thái vô hiệu hóa nếu cần
//     // });
// });


//             $('.modal-result-game').css("display", "flex");
//         });
//     }
//     // Function to play background sound
//     playSoundBackground() {
//         const $audioBackgroundElement = $('.audio-background'); // Lấy phần tử âm thanh nền
//         if ($audioBackgroundElement.length > 0) {
//             // Ensure play is triggered by a user interaction
//             document.addEventListener('click', () => {
//                 $audioBackgroundElement[0].play().catch(error => {
//                     console.error('Audio play failed:', error);
//                 });
//             }, { once: true });
//         }
//     }

//     // Phát âm thanh khi game over
//     playSoundGameOver() {
//         const $audioFailElement = $('.audio-fail');
//         $audioFailElement[0].play();
//     }

//     // Cập nhật cấp độ game
//     // updateGameLevel() {
//     //     // Lấy điểm số hiện tại từ phần tử DOM
//     //     const currentScore = parseInt($('.current-score').text());
//     //     // Lấy phần tử hiển thị cấp độ từ DOM
//     //     const levelElement = $('#level');
//     //     // Lấy giá trị cấp độ hiện tại từ phần tử DOM
//     //     let currentLevel = parseInt(levelElement.text());

//     //     // Kiểm tra nếu điểm số chia hết cho 3 và lớn hơn 0
//     //     if (currentScore % 3 === 0 && currentScore > 0) {
//     //         // Tăng cấp độ hiện tại lên 1
//     //         currentLevel++;
//     //         // Hiển thị cấp độ mới lên giao diện
//     //         levelElement.text(currentLevel);

//     //         // Tăng thêm giá trị cho biến điều khiển thời gian
//     //         this.timeStepDenominator += 3;
//     //         // Cập nhật thời gian bước game
//     //         this.gameTime.timeStep = this.initTimeRemainder / this.timeStepDenominator;

//     //         // Tăng tốc độ phát âm thanh nền
//     //         this.gameSound.audioRatio += 0.1;
//     //         // Đặt lại tốc độ phát âm thanh nền mới
//     //         this.playbackRateAudioBackground(this.gameSound.audioRatio);
//     //     }
//     // }


//     // Đặt tốc độ phát của âm thanh nền
//     playbackRateAudioBackground(rate) {
//         const $audioBackgroundElement = $('.audio-background');
//         $audioBackgroundElement[0].playbackRate = rate;
//     }
// }

// // Sự kiện khi tài liệu đã sẵn sàng
// $(document).ready(() => {
//     const game = new playGame(); // Tạo ra một đối tượng trò chơi mới
//     game.showCountdownModal(); // Hiển thị modal đếm ngược
//     game.showRandomNameCorrect(); // Hiển thị tên sản phẩm đúng ngẫu nhiên
//     game.getAnswer(); // Lấy phản hồi từ người chơi
//     game.playSoundBackground(); // Phát âm thanh nền
// });
