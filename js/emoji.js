if (document.getElementById('post-comment')) owoBig();
// 表情放大
function owoBig() {
    let flag = 1, // 设置节流阀
        owo_time = '', // 设置计时器
        m = 3; // 设置放大倍数
    // 创建盒子
    let div = document.createElement('div'),
        body = document.querySelector('body');
    // 设置ID
    div.id = 'owo-big';
    // 插入盒子
    body.appendChild(div)

    // 构造observer
    let observer = new MutationObserver(mutations => {

        for (let i = 0; i < mutations.length; i++) {
            let dom = mutations[i].addedNodes,
                owo_body = '';
            if (dom.length == 2 && dom[1].className == 'OwO-body') owo_body = dom[1];
                // 如果需要在评论内容中启用此功能请解除下面的注释
            // else if (dom.length == 1 && dom[0].className == 'tk-comment') owo_body = dom[0];
            else continue;

            // 禁用右键（手机端长按会出现右键菜单，为了体验给禁用掉）
            if (document.body.clientWidth <= 768) owo_body.addEventListener('contextmenu', e => e.preventDefault());
            // 鼠标移入
            owo_body.onmouseover = (e) => {
                if (flag && e.target.tagName == 'IMG') {
                    flag = 0;
                    // 移入300毫秒后显示盒子
                    owo_time = setTimeout(() => {
                        let height = e.path[0].clientHeight * m, // 盒子高
                            width = e.path[0].clientWidth * m, // 盒子宽
                            left = (e.x - e.offsetX) - (width - e.path[0].clientWidth) / 2, // 盒子与屏幕左边距离
                            top = e.y - e.offsetY; // 盒子与屏幕顶部距离

                        if ((left + width) > body.clientWidth) left -= ((left + width) - body.clientWidth + 10); // 右边缘检测，防止超出屏幕
                        if (left < 0) left = 10; // 左边缘检测，防止超出屏幕
                        // 设置盒子样式
                        div.style.cssText = `display:flex; height:${height}px; width:${width}px; left:${left}px; top:${top}px;`;
                        // 在盒子中插入图片
                        div.innerHTML = `<img src="${e.target.src}">`
                    }, 300);
                }
            };
            // 鼠标移出隐藏盒子
            owo_body.onmouseout = () => { div.style.display = 'none', flag = 1, clearTimeout(owo_time); }
        }

    })
    observer.observe(document.getElementById('post-comment'), { subtree: true, childList: true }) // 监听的 元素 和 配置项
}

// 分享本页
function share_() {
    let url = window.location.origin + window.location.pathname
    try {
        // 截取标题
        var title = document.title;
        var subTitle = title.endsWith("|我们的编程小屋 ") ? title.substring(0, title.length - 14) : title;
        navigator.clipboard.writeText('airhandsome的站内分享\n标题：' + subTitle + '\n链接：' + url + '\n欢迎来访！');
        new Vue({
            data: function () {
                this.$notify({
                    title: "成功复制分享信息🎉",
                    message: "您现在可以通过粘贴直接跟小伙伴分享了！",
                    position: 'top-left',
                    offset: 50,
                    showClose: true,
                    type: "success",
                    duration: 5000
                });
                // return { visible: false }
            }
        })
    } catch (err) {
        console.error('复制失败！', err);
    }
    // new ClipboardJS(".share", { text: function () { return '标题：' + document.title + '\n链接：' + url } });
    // btf.snackbarShow("本页链接已复制到剪切板，快去分享吧~")
}

// 防抖
function share() {
    debounce(share_, 300);
}

function setMask() {
    //设置遮罩
    if (document.getElementsByClassName("rmMask")[0] != undefined)
        return document.getElementsByClassName("rmMask")[0];
    mask = document.createElement('div');
    mask.className = "rmMask";
    mask.style.width = window.innerWidth + 'px';
    mask.style.height = window.innerHeight + 'px';
    mask.style.background = '#fff';
    mask.style.opacity = '.0';
    mask.style.position = 'fixed';
    mask.style.top = '0';
    mask.style.left = '0';
    mask.style.zIndex = 998;
    document.body.appendChild(mask);
    document.getElementById("rightMenu").style.zIndex = 19198;
    return mask;
}

function insertAtCursor(myField, myValue) {

    //IE 浏览器
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
        sel.select();
    }

    //FireFox、Chrome等
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;

        // 保存滚动条
        var restoreTop = myField.scrollTop;
        myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);

        if (restoreTop > 0) {
            myField.scrollTop = restoreTop;
        }

        myField.focus();
        myField.selectionStart = startPos + myValue.length;
        myField.selectionEnd = startPos + myValue.length;
    } else {
        myField.value += myValue;
        myField.focus();
    }
}

let rmf = {};
rmf.showRightMenu = function (isTrue, x = 0, y = 0) {
    let $rightMenu = $('#rightMenu');
    $rightMenu.css('top', x + 'px').css('left', y + 'px');

    if (isTrue) {
        $rightMenu.show();
    } else {
        $rightMenu.hide();
    }
}

rmf.copyWordsLink = function () {
    let url = window.location.href
    let txa = document.createElement("textarea");
    txa.value = url;
    document.body.appendChild(txa)
    txa.select();
    document.execCommand("Copy");
    document.body.removeChild(txa);
}
rmf.switchReadMode = function () {
    const $body = document.body
    $body.classList.add('read-mode')
    const newEle = document.createElement('button')
    newEle.type = 'button'
    newEle.className = 'fas fa-sign-out-alt exit-readmode'
    $body.appendChild(newEle)

    function clickFn() {
        $body.classList.remove('read-mode')
        newEle.remove()
        newEle.removeEventListener('click', clickFn)
    }

    newEle.addEventListener('click', clickFn)
}

//复制选中文字
rmf.copySelect = function () {
    document.execCommand('Copy', false, null);
}

//回到顶部
rmf.scrollToTop = function () {
    document.getElementsByClassName("menus_items")[1].setAttribute("style", "");
    document.getElementById("name-container").setAttribute("style", "display:none");
    btf.scrollToDest(0, 500);
}

document.body.addEventListener('touchmove', function () {

}, { passive: false });

function popupMenu() {
    window.oncontextmenu = function (event) {
        // if (event.ctrlKey) return true;

        // 当关掉自定义右键时候直接返回
        if (mouseMode == "off") return true;

        $('.rightMenu-group.hide').hide();
        if (document.getSelection().toString()) {
            $('#menu-text').show();
        }
        if (document.getElementById('post')) {
            $('#menu-post').show();
        } else {
            if (document.getElementById('page')) {
                $('#menu-post').show();
            }
        }
        var el = window.document.body;
        el = event.target;
        var a = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
        if (a.test(window.getSelection().toString()) && el.tagName != "A") {
            $('#menu-too').show()
        }
        if (el.tagName == 'A') {
            $('#menu-to').show()
            rmf.open = function () {
                if (el.href.indexOf("http://") == -1 && el.href.indexOf("https://") == -1 || el.href.indexOf("yisous.xyz") != -1) {
                    pjax.loadUrl(el.href)
                }
                else {
                    location.href = el.href
                }
            }
            rmf.openWithNewTab = function () {
                window.open(el.href);
                // window.location.reload();
            }
            rmf.copyLink = function () {
                let url = el.href
                let txa = document.createElement("textarea");
                txa.value = url;
                document.body.appendChild(txa)
                txa.select();
                document.execCommand("Copy");
                document.body.removeChild(txa);
            }
        } else if (el.tagName == 'IMG') {
            $('#menu-img').show()
            rmf.openWithNewTab = function () {
                window.open(el.src);
                // window.location.reload();
            }
            rmf.click = function () {
                el.click()
            }
            rmf.copyLink = function () {
                let url = el.src
                let txa = document.createElement("textarea");
                txa.value = url;
                document.body.appendChild(txa)
                txa.select();
                document.execCommand("Copy");
                document.body.removeChild(txa);
            }
            rmf.saveAs = function () {
                var a = document.createElement('a');
                var url = el.src;
                var filename = url.split("/")[-1];
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
            }
        } else if (el.tagName == "TEXTAREA" || el.tagName == "INPUT") {
            $('#menu-paste').show();
            rmf.paste = function () {
                navigator.permissions
                    .query({
                        name: 'clipboard-read'
                    })
                    .then(result => {
                        if (result.state == 'granted' || result.state == 'prompt') {
                            //读取剪贴板
                            navigator.clipboard.readText().then(text => {
                                console.log(text)
                                insertAtCursor(el, text)
                            })
                        } else {
                            Snackbar.show({
                                text: '请允许读取剪贴板！',
                                pos: 'top-center',
                                showAction: false,
                            })
                        }
                    })
            }
        }
        let pageX = event.clientX + 10;
        let pageY = event.clientY;
        let rmWidth = $('#rightMenu').width();
        let rmHeight = $('#rightMenu').height();
        if (pageX + rmWidth > window.innerWidth) {
            pageX -= rmWidth + 10;
        }
        if (pageY + rmHeight > window.innerHeight) {
            pageY -= pageY + rmHeight - window.innerHeight;
        }
        mask = setMask();
        // 滚动消失的代码和阅读进度有冲突，因此放到readPercent.js里面了
        $(".rightMenu-item").click(() => {
            $('.rmMask').attr('style', 'display: none');
        })
        $(window).resize(() => {
            rmf.showRightMenu(false);
            $('.rmMask').attr('style', 'display: none');
        })
        mask.onclick = () => {
            $('.rmMask').attr('style', 'display: none');
        }
        rmf.showRightMenu(true, pageY, pageX);
        $('.rmMask').attr('style', 'display: flex');
        return false;
    };

    window.addEventListener('click', function () {
        rmf.showRightMenu(false);
    });
}
if (!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
    popupMenu()
}
const box = document.documentElement

function addLongtabListener(target, callback) {
    let timer = 0 // 初始化timer

    target.ontouchstart = () => {
        timer = 0 // 重置timer
        timer = setTimeout(() => {
            callback();
            timer = 0
        }, 380) // 超时器能成功执行，说明是长按
    }

    target.ontouchmove = () => {
        clearTimeout(timer) // 如果来到这里，说明是滑动
        timer = 0
    }

    target.ontouchend = () => { // 到这里如果timer有值，说明此触摸时间不足380ms，是点击
        if (timer) {
            clearTimeout(timer)
        }
    }
}

addLongtabListener(box, popupMenu)

// 全屏
rmf.fullScreen = function () {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
}

// 右键开关
if (localStorage.getItem("mouse") == undefined) {
    localStorage.setItem("mouse", "on");
}
var mouseMode = localStorage.getItem("mouse");
function changeMouseMode() {
    if (localStorage.getItem("mouse") == "on") {
        mouseMode = "off";
        localStorage.setItem("mouse", "off");
        debounce(function () {
            new Vue({
                data: function () {
                    this.$notify({
                        title: "切换右键模式成功🍔",
                        message: "当前鼠标右键已恢复为系统默认！",
                        position: 'top-left',
                        offset: 50,
                        showClose: true,
                        type: "success",
                        duration: 5000
                    });
                }
            })
        }, 300);
    } else {
        mouseMode = "on";
        localStorage.setItem("mouse", "on");
        debounce(function () {
            new Vue({
                data: function () {
                    this.$notify({
                        title: "切换右键模式成功🍔",
                        message: "当前鼠标右键已更换为网站指定样式！",
                        position: 'top-left',
                        offset: 50,
                        showClose: true,
                        type: "success",
                        duration: 5000
                    });
                }
            })
        }, 300);
    }
}

// 存数据
function saveData(name, data) { localStorage.setItem(name, JSON.stringify({ 'time': Date.now(), 'data': data })) };
// 取数据
function loadData(name, time) {
    let d = JSON.parse(localStorage.getItem(name));
    // 过期或有错误返回 0 否则返回数据
    if (d) {
        let t = Date.now() - d.time
        if (-1 < t && t < (time * 60000)) return d.data;
    }
    return 0;
};

let talkTimer = null;
function indexTalk() {
    if (talkTimer) {
        clearInterval(talkTimer)
        talkTimer = null;
    }
    if (!document.getElementById('bber-talk')) return

    function toText(ls) {
        let text = []
        ls.forEach(item => {
            text.push(item.content.replace(/#(.*?)\s/g, '').replace(/\{(.*?)\}/g, '').replace(/\!\[(.*?)\]\((.*?)\)/g, '<i class="fa-solid fa-image"></i>').replace(/\[(.*?)\]\((.*?)\)/g, '<i class="fa-solid fa-link"></i>'))
        });
        return text
    }

    function talk(ls) {
        let html = ''
        ls.forEach((item, i) => { html += `<li class="item item-${i + 1}">${item}</li>` });
        let box = document.querySelector("#bber-talk .talk-list")
        box.innerHTML = html;
        talkTimer = setInterval(() => {
            box.appendChild(box.children[0]);
        }, 3000);
    }

    let d = loadData('talk', 10);
    if (d) talk(d);
    else {
        // memos1.4.0以上版本请在下面的/api/后面加上v1，即/api/v1/memo?creatorId=1&tag=说说&limit=30
        fetch('http://www.notcloud.cn:5230/api/v1/memo?openId=d3eb350b-d1bf-4d56-836b-34b98a81ab99?creatorId=airhandsome&limit=10').then(res => res.json()).then(data => { // 更改地址和ID
            // memos1.4.0以上版本请删除掉下面的一个data，即data = toText(data)
            data = toText(data.data)
            talk(data);
            saveData('talk', data);
        })
    }
}
indexTalk();

// pjax注释掉上面的 indexTalk(); 使用如下方法：
// function whenDOMReady() {
//     indexTalk();
// }

// whenDOMReady()
// document.addEventListener("pjax:complete", whenDOMReady)

// 切换自定义颜色
var defineColor = localStorage.getItem("blogbg") && localStorage.getItem("blogbg").charAt(0) == '#' ? localStorage.getItem("blogbg") : '#F4D88A';
function changeBgColor() {
    changeBg(document.querySelector("#define_colors").value);
}

// 必应每日壁纸API
let bingDayBg = screen.width <= 768 ? "url(https://bing.img.run/m.php)" : "url(https://bing.img.run/1920x1080.php)";
// 必应历史壁纸API
let bingHistoryBg = screen.width <= 768 ? "url(https://bing.img.run/rand_m.php)" : "url(https://bing.img.run/rand.php)";
// EEE.DOG
let EEEDog = "url(https://api.yimian.xyz/img?type=moe&size=1920x1080)";
// 随机美图cdn.seovx.com
let seovx = "url(https://cdn.seovx.com/?mom=302)";
// picsum随机
let picsum = "url(https://picsum.photos/1920/1080.webp)";
// 小歪二次元
// let waiDongman = "url(https://api.ixiaowai.cn/api/api.php)";
//  小歪高清壁纸
let waiBizhi = "url(https://api.ixiaowai.cn/gqapi/gqapi.php)";
// 博天随机
let btstu = "url(http://api.btstu.cn/sjbz/?lx=suiji)";
// tuapi 动漫
// let tuapi = "url(https://tuapi.eees.cc/api.php?category=dongman)";
// unsplash随机 https://source.unsplash.com/random/1920x1080/daily (weekly)
let unsplash = "url(https://source.unsplash.com/random/1920x1080/)";
