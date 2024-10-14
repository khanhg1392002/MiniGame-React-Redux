const productsAssetsPath = "assets/img/products/"; // Đường dẫn tới thư mục hình ảnh sản phẩm
const characterAssetsPath = "assets/img/characters/"; // Đường dẫn tới thư mục hình ảnh nhân vật
const audioAssetsPath = "assets/music/"; // Đường dẫn tới thư mục âm thanh

class layGame {
    constructor() {
        // Khởi tạo các danh sách và dữ liệu cho trò chơi
        this.listProducts = []; // Danh sách sản phẩm
        this.listCharacters = []; // Danh sách nhân vật
        this.listProductNames = []; // Danh sách tên sản phẩm
        

        // Tải dữ liệu từ file JSON
        $.getJSON('assets/data.json', (data) => {
            if (data && data.products && Array.isArray(data.products)) {
                this.listProducts = data.products; // Lưu danh sách sản phẩm vào biến
                console.log('this', this.listProducts);

                // Tạo danh sách tên sản phẩm viết thường
                this.listProductNames = this.listProducts.map((product) =>
                    product.title.toLowerCase()
                );
            } else {
                console.error('Invalid product data format'); // Báo lỗi nếu dữ liệu sản phẩm không hợp lệ
            }

            if (data && data.characters && Array.isArray(data.characters)) {
                this.listCharacters = data.characters; // Lưu danh sách nhân vật vào biến
                console.log('this', this.listCharacters);
            } else {
                console.error('Invalid character data format'); // Báo lỗi nếu dữ liệu nhân vật không hợp lệ
            }

            // Kích hoạt sự kiện khi dữ liệu đã được tải xong
            $(document).trigger('dataLoaded', { products: this.listProducts, characters: this.listCharacters, listName: this.listProductNames });
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            console.error('Error fetching data:', errorThrown); // Báo lỗi nếu có lỗi khi tải dữ liệu
        });

        this.initTimeRemainder = 100; // Thời gian chơi ban đầu
        this.playTimes = 0; // Số lần chơi
        this.requiredNumberProducts = 0; // Số lượng sản phẩm yêu cầu
        this.maxRequiredProducts = 5; // Số lượng sản phẩm tối đa yêu cầu

        // Thông tin về thời gian trong trò chơi
        this.gameTime = {
            timerInterval: null, // Đối tượng interval
            timeRemainder: this.initTimeRemainder, // Thời gian còn lại
            timeStep: this.initTimeRemainder / 10, // Bước thời gian
        };

        // Thông tin về âm thanh trong trò chơi
        this.gameSound = {
            audioBackground: audioAssetsPath + "bg_sound.mp3", // Âm thanh nền
            audioFail: audioAssetsPath + "wrong.mp3", // Âm thanh khi sai
            maxVolumn: 1, // Âm lượng tối đa
            // Tỷ lệ âm thanh (tăng khi cấp độ tăng lên)
            audioRatio: 1,
        };

        this.answerDone = false; // Trạng thái câu trả lời

        this.timeStepDenominator = 10; // Mẫu số bước thời gian
    }

    // Lấy giá trị ngẫu nhiên từ danh sách tên sản phẩm
    getRandomNameCorrect() {
        const randomIndex = Math.floor(Math.random() * this.listProductNames.length);
        return this.listProductNames[randomIndex];
    }

    // Hiển thị modal đếm ngược
    showCountdownModal() {
        const _this = this;
        const getCountDownModalText = $('.modal-count-down h1');
        const initCountDownTime = 3; // Đặt thời gian đếm ngược ban đầu là 3 giây
        getCountDownModalText.text(initCountDownTime);
        let countDownTime = initCountDownTime;

        const intervalId = setInterval(function () {
            countDownTime -= 1;
            getCountDownModalText.text(countDownTime.toString());
            if (countDownTime === 0) { // Khi đếm ngược về 0
                clearInterval(intervalId); // Dừng đếm ngược
                $('.modal-count-down').hide(); // Ẩn modal đếm ngược
                $('.game-content').css("display", "flex"); // Hiển thị nội dung trò chơi
                // _this.showCountdownTime();
            }
        }, 1000);
    }

    // Hiển thị tên sản phẩm yêu cầu ngẫu nhiên
    showRandomNameCorrect() {
        const nameCorrectElements = $('.name-correct');
        nameCorrectElements.css('display', 'none');

        const randomIndex = Math.floor(Math.random() * nameCorrectElements.length);
        const maxRequiredProducts = this.maxRequiredProducts;

        nameCorrectElements.eq(randomIndex).css('display', 'block');

        $.each($('.character-card-list > div img:first-child'), (i, item) => {
            $(item).css('display', i === randomIndex ? 'none' : 'block');
        });

        $.each($('.character-card-list > div img:nth-child(2)'), (i, item) => {
            $(item).css('display', i === randomIndex ? 'block' : 'none');
        });

        const numberCorrect = nameCorrectElements.eq(randomIndex).find(".name-correct-number");
        const descCorrect = nameCorrectElements.eq(randomIndex).find(".name-correct-desc");

        const randomNumber = Math.floor(Math.random() * maxRequiredProducts) + 1;
        numberCorrect.text(randomNumber);
        this.requiredNumberProducts = randomNumber;

        const randomDesc = this.getRandomNameCorrect(this.listProductNames);
        descCorrect.text(randomDesc);
    }

       // Xử lý khi người chơi chọn câu trả lời
       getAnswer() {
        const _this = this; // Lưu tham chiếu của đối tượng playGame

        $('.product-card').off('click').on('click', function () { // Bắt sự kiện click trên các sản phẩm
            const requireProduct = $('.name-correct-desc').text(); // Lấy tên sản phẩm yêu cầu
            const productTitle = $(this).find('.product-card-name').text().toLowerCase(); // Lấy tên sản phẩm được chọn

            // Kiểm tra sản phẩm được chọn có trùng với sản phẩm yêu cầu hay không
            if (productTitle === requireProduct) {
                const numberCorrectElement = $(this).find('.number-correct span:last-child'); // Lấy phần tử số lượng sản phẩm đúng
                const newValue = Number(numberCorrectElement.text()) + 1; // Tăng giá trị số lượng sản phẩm đúng lên 1
                numberCorrectElement.text(newValue); // Cập nhật giá trị mới vào phần tử số lượng sản phẩm đúng

                $(this).find('.number-correct').show(); // Hiển thị phần tử số lượng sản phẩm đúng

                if (newValue === 1) {
                    $(this).find('.number-correct').css("display", "flex"); // Hiển thị phần tử số lượng sản phẩm đúng dưới dạng flexbox
                }

                const requireNumber = _this.requiredNumberProducts; // Lấy số lượng sản phẩm yêu cầu
                if (newValue > requireNumber) {
                    console.log('You choosed over quantity!'); // Log thông báo khi chọn quá số lượng yêu cầu
                    _this.showGameOver(); // Hiển thị màn hình game over
                } else if (newValue === requireNumber) {
                    console.log('You choosed correct'); // Log thông báo khi chọn đúng số lượng yêu cầu

                    setTimeout(() => {
                        _this.resetAnswer(); // Đặt lại câu trả lời
                        _this.showRandomNameCorrect(); // Hiển thị tên sản phẩm yêu cầu mới
                        _this.showScoreCalclulator(); // Tính điểm
                        _this.getAnswer(); // Lắng nghe lại sự kiện chọn sản phẩm mới
                        _this.showCountdownTime(); // Hiển thị đồng hồ đếm ngược
                    }, 300);
                }
            } else {
                console.log('You choosed incorrect!'); // Log thông báo khi chọn sai
                $(".audio-background").get(0).pause(); // Tạm dừng âm thanh nền
                _this.showGameOver(); // Hiển thị màn hình game over
                _this.playSoundGameOver(); // Phát âm thanh khi game over
            }
        });
    }

    // Đặt lại câu trả lời
    resetAnswer() {
        $('.number-correct span:last-child').text('0'); // Đặt lại số lượng sản phẩm đúng về 0
        $('.name-correct-desc').text(''); // Xóa mô tả sản phẩm yêu cầu
        $('.number-correct').css('display', 'none'); // Ẩn phần tử số lượng sản phẩm đúng
        clearInterval(this.gameTime.timerInterval); // Xóa bỏ đếm ngược thời gian còn lại
        this.gameTime.timeRemainder = this.initTimeRemainder; // Thiết lập lại thời gian còn lại
        $(".timer-range").css("width", this.gameTime.timeRemainder + "%"); // Đặt lại thanh tiến trình đếm ngược
    }

    // Hiển thị điểm số
    showScoreCalclulator() {
        const currentScoreElement = $('.current-score'); // Lấy phần tử hiển thị điểm số hiện tại
        let currentScore = parseInt(currentScoreElement.text(), 10) || 0; // Lấy giá trị số điểm hiện tại, nếu không có thì mặc định là 0
        currentScore++; // Tăng số điểm lên 1
        currentScoreElement.text(currentScore); // Hiển thị số điểm mới
        this.updateGameLevel(); // Cập nhật cấp độ trò chơi
    }

    // Hiển thị đồng hồ đếm ngược
    showCountdownTime() {
        let width = this.gameTime.timeRemainder; // Lấy thời gian còn lại
        const _this = this; // Lưu tham chiếu của đối tượng playGame
        const timerContainer = $('.timer-site'); // Lấy phần tử chứa đồng hồ đếm ngược
        const timerBar = $('.timer-range'); // Lấy thanh tiến trình của đồng hồ đếm ngược
        const containerWidth = timerContainer.width(); // Lấy chiều rộng của phần tử chứa đồng hồ đếm ngược

        timerBar.width(containerWidth); // Thiết lập chiều rộng ban đầu của thanh tiến trình

        this.gameTime.timerInterval = setInterval(() => { // Khởi tạo đếm ngược
            width -= _this.gameTime.timeStep; // Giảm thời gian còn lại dựa trên bước thời gian
            console.log(width); // Log thời gian còn lại (có thể loại bỏ khi hoàn thành)
            this.gameTime.timeRemainder -= _this.gameTime.timeStep; // Cập nhật thời gian còn lại
            $(".timer-range").css("width", width + "%"); // Cập nhật thanh tiến trình

            if (width <= 0) { // Khi thời gian còn lại bằng hoặc nhỏ hơn 0
                _this.showResultGame(); // Hiển thị màn hình khởi động lại trò chơi
                clearInterval(this.gameTime.timerInterval); // Xóa bỏ đếm ngược
            }
        }, 1000); // Đếm ngược theo mỗi giây
    }

    // Hiển thị modal game over
    showGameOver() {
        clearInterval(this.gameTime.timerInterval); // Xóa bỏ đếm ngược thời gian còn lại
        const _this = this; // Lưu tham chiếu của đối tượng playGame
        $('.false-clicked-modal').css("display", "flex"); // Hiển thị modal game over

        setTimeout(() => {
            _this.showResultGame(); // Hiển thị màn hình khởi động lại trò chơi
        }, 4000); // Sau 4 giây
    }

    showResultGame() {
        $('.false-clicked-modal').css("display", "none"); // Ẩn modal game over
        $('.modal-result-game').load('./view/result-game.html', function() {
            const setScoreTotal = $('.final-score-text'); // Lấy phần tử hiển thị tổng điểm
            const getCurrentScore = $('.current-score'); // Lấy phần tử hiển thị điểm hiện tại
            const score = getCurrentScore.text(); // Lấy giá trị điểm hiện tại
            setScoreTotal.text(score); // Hiển thị giá trị điểm vào phần tử tổng điểm
    
            // Bắt sự kiện click vào nút khởi động lại trò chơi
            $('.restart-game-text').on('click', function () {
                $('.modal-result-game').hide(); // Ẩn modal khởi động lại trò chơi
                location.reload(); // Tải lại trang
            });
    
            // Bắt sự kiện click vào nút đóng modal khởi động lại trò chơi
            $('.result-game-button-close').on('click', function () {
                $('.modal-result-game').hide(); // Ẩn modal khởi động lại trò chơi
            });
    
            $('.modal-result-game').css("display", "flex"); // Hiển thị modal khởi động lại trò chơi
        });
    }
    

    // Phát âm thanh nền
    playSoundBackground() {
        const $audioBackgroundElement = $('.audio-background'); // Lấy phần tử âm thanh nền
        setTimeout(() => {
            $audioBackgroundElement[0].play(); // Phát âm thanh nền sau 3 giây
        }, 3000); // 3000 ms = 3 giây
    }

    // Phát âm thanh khi game over
    playSoundGameOver() {
        const $audioFailElement = $('.audio-fail'); // Lấy phần tử âm thanh khi game over
        $audioFailElement[0].play(); // Phát âm thanh khi game over
    }

    // Cập nhật cấp độ trò chơi
    updateGameLevel() {
        const currentScore = parseInt($('.current-score').text()); // Lấy điểm số hiện tại
        const levelElement = $('#level'); // Lấy phần tử hiển thị cấp độ
        let currentLevel = parseInt(levelElement.text()); // Lấy giá trị cấp độ hiện tại

        if (currentScore % 3 === 0 && currentScore > 0) { // Nếu điểm số chia hết cho 3 và lớn hơn 0
            currentLevel++; // Tăng cấp độ lên 1
            levelElement.text(currentLevel); // Hiển thị cấp độ mới

            this.timeStepDenominator += 3; // Tăng bước thời gian theo cấp độ
            this.gameTime.timeStep = this.timeStepDenominator; // Cập nhật bước thời gian

            // Tăng tốc độ phát âm thanh nền
            this.gameSound.audioRatio += 0.1; // Tăng tỷ lệ âm thanh
            this.playbackRateAudioBackground(this.gameSound.audioRatio); // Cập nhật tốc độ phát âm thanh nền
        }
    }

    // Đặt tốc độ phát âm thanh nền
    playbackRateAudioBackground(rate) {
        const $audioBackgroundElement = $('.audio-background'); // Lấy phần tử âm thanh nền
        $audioBackgroundElement[0].playbackRate = rate; // Đặt tốc độ phát âm thanh nền
    }
};