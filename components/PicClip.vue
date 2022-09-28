<template>
    <div :class="['clip', theme]">
        <div v-if="imgUrl" class="picture">
            <b-img-lazy :src="imgUrl" />
        </div>
        <i v-else class="iconfont icon-upload icon"></i>
        <input ref="uploadImg" type="file" :accept="accept" @change="getImg($event)" />
        <transition name="opacity">
            <div v-show="showPopup" :class="['popup', { 'clip-popup': autoClip }]">
                <img ref="image" :src="clipImg" alt="" />
                <div v-if="autoClip" class="popup-move" @mousedown="startMove" @touchstart.prevent="startMove"></div>
                <div v-if="autoClip" ref="clipBox" class="clip-box">
                    <span class="clip-view">
                        <img ref="clipImage" :src="clipImg" alt="" />
                    </span>
                    <span class="clip-move" @mousedown="clipMove" @touchstart.prevent="clipMove"></span>
                    <span class="clip-info" v-text="clipSizeValue"></span>
                    <span v-if="!fixedBox">
                        <i
                            class="clip-line line-t"
                            @mousedown="changeClipSize($event, false, true, 0, 1)"
                            @touchstart.prevent="changeClipSize($event, false, true, 0, 1)"
                        ></i>
                        <i
                            class="clip-line line-r"
                            @mousedown="changeClipSize($event, true, false, 2, 0)"
                            @touchstart.prevent="changeClipSize($event, true, false, 2, 0)"
                        ></i>
                        <i
                            class="clip-line line-b"
                            @mousedown="changeClipSize($event, false, true, 0, 2)"
                            @touchstart.prevent="changeClipSize($event, false, true, 0, 2)"
                        ></i>
                        <i
                            class="clip-line line-l"
                            @mousedown="changeClipSize($event, true, false, 1, 0)"
                            @touchstart.prevent="changeClipSize($event, true, false, 1, 0)"
                        ></i>
                        <i
                            class="clip-point point-tr"
                            @mousedown="changeClipSize($event, true, true, 2, 1)"
                            @touchstart.prevent="changeClipSize($event, true, true, 2, 1)"
                        ></i>
                        <i
                            class="clip-point point-br"
                            @mousedown="changeClipSize($event, true, true, 2, 2)"
                            @touchstart.prevent="changeClipSize($event, true, true, 2, 2)"
                        ></i>
                        <i
                            class="clip-point point-bl"
                            @mousedown="changeClipSize($event, true, true, 1, 2)"
                            @touchstart.prevent="changeClipSize($event, true, true, 1, 2)"
                        ></i>
                        <i
                            class="clip-point point-tl"
                            @mousedown="changeClipSize($event, true, true, 1, 1)"
                            @touchstart.prevent="changeClipSize($event, true, true, 1, 1)"
                        ></i>
                    </span>
                </div>
                <div v-if="autoClip" class="range">
                    <span>0%</span>
                    <input v-model="imgScaleVal" type="range" min="0" max="100" @input="imageScale($event)" />
                    <span>100%</span>
                </div>
                <div class="button">
                    <b-button variant="outline-danger" size="sm" @click="cancel">{{ $t('Cancel') }}</b-button>
                    <b-button size="sm" @click="rotate('right')">{{ $t('Left 90°') }}</b-button>
                    <b-button size="sm" @click="rotate('left')">{{ $t('Right 90°') }}</b-button>
                    <b-button size="sm" @click="finish">{{ $t('Confirm') }}</b-button>
                </div>
            </div>
        </transition>
        <transition name="opacity">
            <span v-show="msgStatus" class="msg" v-text="msg"></span>
        </transition>
    </div>
</template>

<script>
const extend = (target, source) => {
    for (const key in source) target[key] = source[key]
    return target
}
export default {
    name: 'PicClip',
    props: {
        accept: {
            type: String,
            default: 'image/png, image/jpeg, image/jpg, image/gif'
        },
        autoClip: {
            // 是否生成截图框
            type: Boolean,
            default: false
        },
        autoClipWidth: {
            // 截图框的宽度，最大不超过容器宽度，【默认容器宽度的80%】
            type: Number,
            default: 0
        },
        autoClipHeight: {
            // 截图框的高度，最大不超过容器的高度，【默认容器宽度的80%】
            type: Number,
            default: 0
        },
        canMove: {
            // 上传图片能否拖动
            type: Boolean,
            default: false
        },
        canMoveBox: {
            // 截图框能否拖动
            type: Boolean,
            default: false
        },
        dataUrlType: {
            // 输出图片数据的类型，默认Bolb
            type: String,
            default: 'blob'
        },
        fixed: {
            // 截图框是否开启固定宽高比。开启宽高比，若设置的宽高比例与宽高比不匹配，则按照宽高比计算高度
            type: Boolean,
            default: false
        },
        fixedNumber: {
            // 宽高比 w/h
            type: Array,
            default: () => {
                return [1, 1]
            }
        },
        fixedBox: {
            // 固定大小，禁止改变截图框大小
            type: Boolean,
            default: false
        },
        img: {
            type: [String, Blob, null, File],
            default: ''
        },
        isOriginalImg: {
            // 是否上传原图(启用裁剪时，上传原图无效)
            type: Boolean,
            default: false
        },
        maxWidth: {
            // 生成图片的最大宽度（启用裁剪或上传原图时最大宽度无效）
            type: Number,
            default: 600
        },
        maxHeight: {
            // 生成图片的最大高度（启用裁剪或上传原图时最大高度无效）
            type: Number,
            default: 600
        },
        outputSize: {
            // 输出图片压缩比
            type: Number,
            default: 1
        },
        outputType: {
            // 生成图片的格式，默认jpg(jpg需要传入jpeg)【jpeg、png、webp】
            type: String,
            default: 'png'
        },
        theme: {
            // 样式风格
            type: String,
            default: 'rect'
        }
    },
    data() {
        return {
            rotateAngle: 0, // 旋转角度
            dateFile: null,
            screenWidth: document.documentElement.clientWidth,
            screenHeight: document.documentElement.clientHeight - 48,
            imgUrl: this.img, // 上传图片预览
            imgName: '', // 上传图片的名称
            image: '', // 图片对象
            clipImg: '', // 裁剪后的图片
            showPopup: false,
            imgScaleVal: 0, // 百分比
            moveX: 0, // 图片移动的x
            moveY: 0, // 图片移动的y
            clipWidth: 0, // 截图框的宽度
            clipHeight: 0, // 截图框的高度
            clipMoveX: 0, // 截图框移动的x
            clipMoveY: 0, // 截图框移动的y
            clipOldX: 0,
            clipOldY: 0,
            canChangeX: false, // 是否能改变截图框x轴值
            canChangeY: false, // 是否能改变截图框y轴值
            changeClipTypeX: 1, // 改变的基准点 0:不变、1:截图框左边变化、2：截图框右边变化
            changeClipTypeY: 1, // 改变的基准点 0:不变、1:截图框上边变化、2:截图框下边变化
            imgSize: {
                // 图片的尺寸、位置、缩放比
                x: 0,
                y: 0,
                w: 0,
                h: 0,
                s: 1
            },
            boxSize: {
                // 截图框的尺寸、位置
                x: 0,
                y: 0,
                w: 0,
                h: 0,
                s: 1
            },
            msg: '',
            msgStatus: false,
            msgTimer: null
        }
    },
    computed: {
        /* 计算截图框的尺寸数值 */
        clipSizeValue() {
            const w = this.boxSize.w === 0 ? (this.screenWidth * 0.8).toFixed(0) : this.boxSize.w
            const h = this.boxSize.h === 0 ? (this.screenWidth * 0.8).toFixed(0) : this.boxSize.h
            return `${w} x ${h}  ${this.imgScaleVal}%`
        },
        pictureType() {
            return this.accept.split(',').map(x => {
                return x.split('/')[1]
            })
        }
    },
    watch: {
        img(v) {
            this.imgUrl = this.img
        }
    },
    methods: {
        /*
         * 将File类型文件转变为dataURL字符串
         * @param: [file] [file类型文件]
         * @param: [fn] [回调函数，包含一个dataURL类型的参数]
         */
        filetoDataURL(file, fn) {
            const reader = new FileReader()
            reader.onload = function (e) {
                fn(e.target.result)
            }
            reader.readAsDataURL(file)
        },
        /*
         * 将一串dataURL转变为Image类型文件
         * @param: [dataUrl] [dataURL字符串]
         */
        dataURLtoImage(dataUrl) {
            return new Promise(resolve => {
                const img = new Image()
                img.onload = () => {
                    resolve(img)
                }
                img.src = dataUrl
            })
        },
        /*
         * 将Canvas类型对象转换成Blob类型对象
         * @param: [canvas] [Canvas类型对象]
         * @param: [fn] [回调函数，包含一个Blob对象]
         */
        canvasResizetoFile(canvas, fn) {
            canvas.toBlob(
                blob => {
                    fn(blob)
                },
                `image/${this.outputType}`,
                this.outputSize
            )
        },
        /*
         * 将Canvas对象转换成dataURL字符串
         * @param: [canvas] [Canvas类型对象]
         */
        canvasResizetoDataURL(canvas) {
            return canvas.toDataURL(`image/${this.outputType}`, this.outputSize)
        },
        /*
         * 将Image类型文件转换为Canvas类型对象
         * @param: [img] [图片]
         * @param: [sx] [开始剪切的x坐标位置]
         * @param: [sy] [开始剪切的y坐标位置]
         * @param: [imgWidth] [被裁减的图片宽度]
         * @param: [imgHeight] [被裁剪的图片高度]
         * @param: [clipWidth] [剪切图像的宽度，不传默认img宽度]
         * @param: [clipHeight] [剪切图像的高度，不传默认img高度]
         */
        imagetoCanvas(img, sx, sy, imgWidth, imgHeight, clipWidth, clipHeight) {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const cw = clipWidth || img.width
            const ch = clipHeight || img.height
            canvas.width = cw
            canvas.height = ch
            ctx.drawImage(img, sx, sy, imgWidth, imgHeight, 0, 0, cw, ch)
            return canvas
        },
        /*
         * 获取上传图片
         */
        getImg(e) {
            const files = e.target.files || e.dataTransfer.files
            if (files.length === 0) {
                return false
            }
            const file = files[0]
            this.imgName = file.name
            if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
                // 判断上传的是否是图片类型文件。几乎可以忽略此段代码
                this.msg = `图片类型必须是${this.pictureType.join('、')}中的一种`
                this.msgStatus = true
                clearTimeout(this.msgTimer)
                this.msgTimer = setTimeout(() => {
                    this.msgStatus = false
                    clearTimeout(this.msgTimer)
                }, 1500)
                return false
            }
            if (file) {
                this.rotateAngle = 0
                this.dateFile = file
                this.fileToPreviewImage(file, this.rotateAngle)
            }
        },
        /*
         * 生成预览图片，截图框
         * @param: [file] [上传图片]
         */
        fileToPreviewImage(file) {
            this.filetoDataURL(file, dataUrl => {
                // 转换成base64
                this.isRotate(dataUrl, this.rotateAngle).then(url => {
                    this.clipImg = url
                    this.dataURLtoImage(url).then(image => {
                        // 图片转换成image对象， 显示预览图片弹出层
                        this.image = image
                        const size = this.resizeSizeImg(image, this.screenWidth, this.screenHeight) // 计算图片尺寸、缩放
                        extend(this.imgSize, size)
                        this.$nextTick(() => {
                            this.imgScaleVal = (this.imgSize.s * 100).toFixed(0) // 默认图片缩放百分比
                            this.toClipPopup(image)
                            this.showPopup = true
                        })
                    })
                })
            })
        },
        /*
         * 根据exif信息，判断图片是否需要旋转，旋转图片
         * @param: [dataUrl] [图片的base64数据]
         */
        isRotate(dataUrl) {
            return new Promise(resolve => {
                if (this.rotateAngle) {
                    this.dataURLtoImage(dataUrl).then(image => {
                        const canvas = document.createElement('canvas')
                        const ctx = canvas.getContext('2d')
                        ctx.save()
                        const degree = (this.rotateAngle * 90 * Math.PI) / 180
                        switch (this.rotateAngle) {
                            case 0:
                                canvas.width = image.width
                                canvas.height = image.height
                                ctx.drawImage(image, 0, 0)
                                break
                            case 1:
                                canvas.width = image.height
                                canvas.height = image.width
                                ctx.rotate(degree)
                                ctx.drawImage(image, 0, -image.height)
                                break
                            case 2:
                                canvas.width = image.width
                                canvas.height = image.height
                                ctx.rotate(degree)
                                ctx.drawImage(image, -image.width, -image.height)
                                break
                            case 3:
                                canvas.width = image.height
                                canvas.height = image.width
                                ctx.rotate(degree)
                                ctx.drawImage(image, -image.width, 0)
                                break
                        }
                        ctx.restore()
                        resolve(this.canvasResizetoDataURL(canvas))
                    })
                } else {
                    resolve(dataUrl)
                }
            })
        },
        /* 获取图片exif要将图片转换成ArrayBuffer对象， base64转换ArrayBuffer对象 */
        base64ToArrayBuffer(dataUrl) {
            dataUrl = dataUrl.replace(/^data:([^;]+);base64,/gim, '')
            const binary = atob(dataUrl)
            const len = binary.length
            const buffer = new ArrayBuffer(len)
            const view = new Uint8Array(buffer)
            for (let i = 0; i < len; i++) {
                view[i] = binary.charCodeAt(i)
            }
            return buffer
        },
        /*
         * Unicode码转字符串
         * ArrayBuffer对象，Unicode码转字符串
         */
        getStringFromCharCode(dataView, start, length) {
            let str = ''
            let i
            for (i = start, length += start; i < length; i++) {
                str += String.fromCharCode(dataView.getUint8(i))
            }
            return str
        },
        /*
         * 获取jpg图片的exif角度（在ios体现最明显）
         * @param: [dataUrl] [图片的base64数据]
         */
        getOrientation(dataUrl) {
            const arrayBuffer = this.base64ToArrayBuffer(dataUrl)
            const dataView = new DataView(arrayBuffer)
            let length = dataView.byteLength
            let orientation
            let exifIDCode
            let tiffOffest
            let firstIFDOffest
            let littleEndian
            let endianness
            let app1Start
            let ifdStart
            let offset
            let i
            // Only handle JPEG image (start by 0xFFD8)
            if (dataView.getUint8(0) === 0xff && dataView.getUint8(1) === 0xd8) {
                offset = 2
                while (offset < length) {
                    if (dataView.getUint8(offset) === 0xff && dataView.getUint8(offset + 1) === 0xe1) {
                        app1Start = offset
                        break
                    }
                    offset++
                }
            }
            if (app1Start) {
                exifIDCode = app1Start + 4
                tiffOffest = app1Start + 10
                if (this.getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
                    endianness = dataView.getUint16(tiffOffest)
                    littleEndian = endianness === 0x4949
                    if (littleEndian || endianness === 0x4d4d /* bigEndian */) {
                        if (dataView.getUint16(tiffOffest + 2, littleEndian) === 0x002a) {
                            firstIFDOffest = dataView.getUint32(tiffOffest + 4, littleEndian)
                            if (firstIFDOffest >= 0x00000008) {
                                ifdStart = tiffOffest + firstIFDOffest
                            }
                        }
                    }
                }
            }
            if (ifdStart) {
                length = dataView.getUint16(ifdStart, littleEndian)
                for (i = 0; i < length; i++) {
                    offset = ifdStart + i * 12 + 2
                    if (dataView.getUint16(offset, littleEndian) === 0x0112 /* Orientation */) {
                        // 8 is the offset of the current tag's value
                        offset += 8
                        // Get the original orientation value
                        orientation = dataView.getUint16(offset, littleEndian)
                        // Override the orientation with its default value for Safari (#120)
                        // if (IS_SAFARI_OR_UIWEBVIEW) {
                        //   dataView.setUint16(offset, 1, littleEndian)
                        // }
                        break
                    }
                }
            }
            return orientation
        },
        /* 取消上传图片 */
        cancel() {
            this.rotateAngle = 0
            this.showPopup = false
            this.$refs.uploadImg.value = ''
        },
        rotate(direction) {
            if (direction === 'left') {
                if (this.rotateAngle === 3) {
                    this.rotateAngle = 0
                } else {
                    this.rotateAngle++
                }
            } else if (this.rotateAngle === 0) {
                this.rotateAngle = 3
            } else {
                this.rotateAngle--
            }
            this.fileToPreviewImage(this.dateFile, this.rotateAngle)
        },
        /* 完成上传图片 */
        finish() {
            let canvas = null
            if (this.autoClip) {
                // 按截图框裁剪图片
                canvas = this.imagetoCanvas(
                    this.image,
                    (this.boxSize.x - this.imgSize.x - (this.image.width * (1 - this.imgSize.s)) / 2) / this.imgSize.s,
                    (this.boxSize.y - this.imgSize.y - (this.image.height * (1 - this.imgSize.s)) / 2) / this.imgSize.s,
                    this.boxSize.w / this.imgSize.s,
                    this.boxSize.h / this.imgSize.s,
                    this.boxSize.w,
                    this.boxSize.h
                )
            } else {
                const size = this.resizeSizeImg(this.image, this.maxWidth, this.maxHeight)
                canvas = this.imagetoCanvas(this.image, 0, 0, this.image.width, this.image.height, size.w, size.h)
            }
            if (this.dataUrlType === 'blob') {
                this.canvasResizetoFile(canvas, blob => {
                    this.imgUrl = URL.createObjectURL(blob)
                    this.$emit('finish', this.imgName, blob)
                })
            } else {
                const url = this.canvasResizetoDataURL(canvas)
                this.imgUrl = url
                this.$emit('finish', this.imgName, url)
            }
            this.$refs.uploadImg.value = ''
            this.showPopup = false
            this.rotateAngle = 0
        },
        /*
         * 计算图片等比压缩尺寸
         * @param: [img] [图片]
         * @param: [maxWidth] [最大宽度]
         * @param: [maxHeight] [最大高度]
         */
        resizeSizeImg(img, maxWidth, maxHeight) {
            const width = img.width
            const height = img.height
            const imgInfo = {
                x: (maxWidth - width) / 2,
                y: (maxHeight - height) / 2,
                w: width,
                h: height,
                s: 1
            }
            if ((imgInfo.w < maxWidth && imgInfo.h < maxHeight) || this.isOriginalImg) {
                return imgInfo
            }
            const scale = parseFloat(imgInfo.w / imgInfo.h) // 计算宽高比
            const sizeByMw = {
                // 按照宽等比计算高
                x: (maxWidth - width) / 2,
                y: (maxHeight - height) / 2,
                w: maxWidth,
                h: parseInt(maxWidth / scale),
                s: maxWidth / width
            }
            const sizeByMh = {
                // 按照高等比计算宽
                x: (maxWidth - width) / 2,
                y: (maxHeight - height) / 2,
                w: parseInt(maxHeight * scale),
                h: maxHeight,
                s: maxHeight / height
            }
            if (sizeByMw.h <= maxHeight) {
                return sizeByMw
            }
            if (sizeByMh.w <= maxWidth) {
                return sizeByMh
            }
            return {
                x: 0,
                y: 0,
                w: maxWidth,
                h: maxHeight,
                s: maxWidth / width
            }
        },
        /*
         * 生成截图弹出层
         * @param: [image] [图片对象]
         */
        toClipPopup(image) {
            const element = this.$refs.image
            this.imgSize.w = image.width
            this.imgSize.h = image.height
            this.setElementStyle(element, this.imgSize)
            if (this.autoClip) {
                this.setClipBoxSize()
            }
        },
        /*
         * 计算截图框的尺寸、位置
         */
        setClipBoxSize() {
            const scale = this.fixedNumber[0] / this.fixedNumber[1]
            this.clipWidth = this.autoClipWidth === 0 ? parseInt(this.screenWidth * 0.8) : this.autoClipWidth
            this.clipHeight =
                this.autoClipHeight === 0
                    ? parseInt((this.screenWidth * 0.8) / scale)
                    : this.fixed
                    ? parseInt(this.autoClipWidth / scale)
                    : this.autoClipHeight
            const size = {
                x: (this.screenWidth - this.clipWidth) / 2,
                y: (this.screenHeight - this.clipHeight) / 2,
                w: this.clipWidth,
                h: this.clipHeight,
                s: 1
            }
            extend(this.boxSize, size)
            this.clipBoxStyle()
        },
        /*
         * 设置截图框尺寸、位置、缩放
         */
        clipBoxStyle() {
            this.$nextTick(() => {
                this.setElementStyle(this.$refs.clipBox, this.boxSize)
                this.clipBoxImgSize()
            })
        },
        /*
         * 设置截图框内的图片尺寸、相对截图框的位置
         */
        clipBoxImgSize() {
            const size = {
                x: this.imgSize.x - this.boxSize.x,
                y: this.imgSize.y - this.boxSize.y,
                w: this.imgSize.w,
                h: this.imgSize.h,
                s: this.imgSize.s
            }
            this.setElementStyle(this.$refs.clipImage, size)
        },
        /* 给元素添加样式，尺寸、位置 */
        setElementStyle(image, size) {
            image.style.width = `${size.w}px`
            image.style.height = `${size.h}px`
            image.style.transform = `translate3d(${size.x}px, ${size.y}px, 0) scale(${size.s}, ${size.s})`
        },
        /* 图片缩放 */
        imageScale(e) {
            this.imgSize.s = e.target.value / 100
            this.$nextTick(() => {
                const element = this.$refs.image
                this.setElementStyle(element, this.imgSize)
                this.clipBoxStyle(this.image)
            })
        },
        /* 开始移动图片 */
        startMove(e) {
            e.preventDefault()
            if (!this.canMove) {
                return false
            }
            const touch = e.touches ? e.touches[0] : e
            this.moveX = this.imgSize.x - touch.clientX
            this.moveY = this.imgSize.y - touch.clientY
            window.addEventListener('mousemove', this.moveImg)
            window.addEventListener('mouseup', this.leaveImg)
            window.addEventListener('touchmove', this.moveImg)
            window.addEventListener('touchend', this.leaveImg)
        },
        /* 移动图片 */
        moveImg(e) {
            const touch = e.touches ? e.touches[0] : e
            const nowX = touch.clientX
            const nowY = touch.clientY
            const changeX = nowX + this.moveX
            const changeY = nowY + this.moveY
            this.imgSize.x = changeX
            this.imgSize.y = changeY
            this.$nextTick(() => {
                this.setElementStyle(this.$refs.image, this.imgSize)
                this.clipBoxImgSize()
            })
        },
        /* 移动图片结束 */
        leaveImg() {
            window.removeEventListener('mousemove', this.moveImg)
            window.removeEventListener('mouseup', this.leaveImg)
            window.removeEventListener('touchmove', this.moveImg)
            window.removeEventListener('touchend', this.leaveImg)
        },
        /* 裁剪框移动 */
        clipMove(e) {
            e.preventDefault()
            if (!this.canMoveBox) {
                return false
            }
            const touch = e.touches ? e.touches[0] : e
            this.clipMoveX = this.boxSize.x - touch.clientX
            this.clipMoveY = this.boxSize.y - touch.clientY
            this.clipWidth = this.boxSize.w
            this.clipHeight = this.boxSize.h
            window.addEventListener('mousemove', this.moveClip)
            window.addEventListener('mouseup', this.leaveClip)
            window.addEventListener('touchmove', this.moveClip)
            window.addEventListener('touchend', this.leaveClip)
        },
        /* 移动截图框 */
        moveClip(e) {
            const touch = e.touches ? e.touches[0] : e
            const nowX = touch.clientX
            const nowY = touch.clientY
            const changeX = nowX + this.clipMoveX
            const changeY = nowY + this.clipMoveY
            // 不能超过外层容器
            if (changeX < 0) {
                this.boxSize.x = 0
            } else if (changeX > this.screenWidth - this.clipWidth) {
                this.boxSize.x = this.screenWidth - this.clipWidth
            } else {
                this.boxSize.x = changeX
            }
            if (changeY < 25) {
                this.boxSize.y = 25
            } else if (changeY > this.screenHeight - this.clipHeight) {
                this.boxSize.y = this.screenHeight - this.clipHeight
            } else {
                this.boxSize.y = changeY
            }
            this.clipBoxStyle()
        },
        /* 截图框移动结束 */
        leaveClip() {
            window.removeEventListener('mousemove', this.moveClip)
            window.removeEventListener('mouseup', this.leaveClip)
            window.removeEventListener('touchmove', this.moveClip)
            window.removeEventListener('touchend', this.leaveClip)
        },
        /*
         * 改变截图框大小
         * @param: [x] [Boolean] [是否能改变坐标轴x]
         * @param: [y] [Boolean] [是否能改变坐标轴y]
         * @param: [typeX] [Number] [0:不变、1:截图框左边变化、2：截图框右边变化]
         * @Param: [typeY] [Number] [0:不变、1:截图框上边变化、2：截图框下边变化]
         */
        changeClipSize(e, x, y, typeX, typeY) {
            e.preventDefault()
            window.addEventListener('mousemove', this.changeClipNow)
            window.addEventListener('mouseup', this.changeClipEnd)
            window.addEventListener('touchmove', this.changeClipNow)
            window.addEventListener('touchend', this.changeClipEnd)
            const touch = e.touches ? e.touches[0] : e
            this.canChangeX = x
            this.canChangeY = y
            this.changeClipTypeX = typeX
            this.changeClipTypeY = typeY
            this.clipMoveX = touch.clientX
            this.clipMoveY = touch.clientY
            this.clipOldX = parseInt(this.boxSize.x)
            this.clipOldY = parseInt(this.boxSize.y)
            this.clipWidth = parseInt(this.boxSize.w)
            this.clipHeight = parseInt(this.boxSize.h)
            if (this.fixed) {
                if (x && y) {
                    this.canChangeY = 0
                }
            }
        },
        /* 正在改变截图框大小 */
        changeClipNow(e) {
            const touch = e.touches ? e.touches[0] : e
            const changeX = parseInt(touch.clientX - this.clipMoveX)
            const changeY = parseInt(touch.clientY - this.clipMoveY)
            const maxW = this.screenWidth // 容器的宽度
            const maxH = this.screenHeight // 容器的高度
            if (this.canChangeX) {
                // x轴可变
                if (this.changeClipTypeX === 1) {
                    // 以右边框为基准
                    const w = this.clipWidth - changeX
                    const x = this.clipOldX + changeX
                    if (w > 0) {
                        this.boxSize.x = x > 0 ? x : 0
                        this.boxSize.w = x > 0 ? w : this.clipWidth + this.clipOldX
                    } else {
                        this.boxSize.x = this.clipWidth + this.clipOldX
                        this.boxSize.w = x > maxW ? maxW - this.boxSize.x : Math.abs(w)
                    }
                } else if (this.changeClipTypeX === 2) {
                    // 以左边框为基准
                    const w = this.clipWidth + changeX
                    const x = this.clipOldX - Math.abs(w)
                    if (w > 0) {
                        this.boxSize.x = this.clipOldX
                        this.boxSize.w = w + this.clipOldX > maxW ? maxW - this.clipOldX : w
                    } else {
                        this.boxSize.x = x > 0 ? x : 0
                        this.boxSize.w = x > 0 ? Math.abs(w) : this.clipOldX
                    }
                }
            }
            if (this.canChangeY) {
                // y轴方向可变
                if (this.changeClipTypeY === 1) {
                    // 以下边框为基准 25为y轴预留的最小距离
                    const y = this.clipOldY + changeY
                    const h = this.clipHeight - changeY
                    if (h > 0) {
                        this.boxSize.y = y > 25 ? y : 25
                        this.boxSize.h = y > 25 ? h : this.clipHeight + this.clipOldY - 25
                    } else {
                        this.boxSize.y = this.clipHeight + this.clipOldY
                        this.boxSize.h = y > maxH ? maxH - this.boxSize.y : Math.abs(h)
                    }
                } else if (this.changeClipTypeY === 2) {
                    // 以上边框为基准
                    const h = this.clipHeight + changeY
                    const y = this.clipOldY - Math.abs(h)
                    if (h > 0) {
                        // 判断移动下边框，是否超出截图框的上边框
                        this.boxSize.y = this.clipOldY
                        this.boxSize.h = this.clipOldY + h > maxH ? maxH - this.clipOldY : h
                    } else {
                        this.boxSize.y = y > 25 ? y : 25
                        this.boxSize.h = y > 25 ? Math.abs(h) : this.clipOldY - 25
                    }
                }
            }
            // 等比缩放
            const scale = this.fixedNumber[0] / this.fixedNumber[1]
            if (this.canChangeX && this.fixed) {
                const fixedHeight = this.boxSize.w / scale
                if (fixedHeight + this.clipOldY > maxH) {
                    this.boxSize.h = maxH - this.clipOldY
                    this.boxSize.w = this.boxSize.h * scale
                } else {
                    this.boxSize.h = fixedHeight
                }
            }
            if (this.canChangeY && this.fixed) {
                const fixedWidth = this.boxSize.h * scale
                if (fixedWidth + this.clipOldX > maxW) {
                    this.boxSize.w = maxW - this.clipOldX
                    this.boxSize.h = this.boxSize.w / scale
                } else {
                    this.boxSize.w = fixedWidth
                }
            }
            this.clipBoxStyle()
        },
        /* 结束改变截图框大小 */
        changeClipEnd() {
            window.removeEventListener('mousemove', this.changeClipNow)
            window.removeEventListener('mouseup', this.changeClipEnd)
            window.removeEventListener('touchmove', this.changeClipNow)
            window.removeEventListener('touchend', this.changeClipEnd)
        }
    }
}
</script>

<style lang="css" scoped>
.clip {
    position: relative;
    width: 100%;
    height: 100%;
}

.icon {
    font-size: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.clip .icon,
.clip > input {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
}

.clip .picture {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 20;
}

.clip .picture img {
    max-width: 100%;
    max-height: 100%;
}

.clip > input {
    width: 100%;
    opacity: 0;
    z-index: 30;
}

.clip .icon {
    text-align: center;
    border: 2px solid rgb(0 0 0 / 10%);
}

.clip .icon i {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.clip .msg {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 30;
    padding: 5px 20px;
    border-radius: 5px;
    transform: translate(-50%, -50%);
    color: #fff;
    text-align: center;
    background: rgb(0 0 0 / 70%);
}

.rect .icon i {
    height: 80%;
}

.rect .icon i::before {
    content: '\e641';
    line-height: 42px;
}

.rect p {
    margin-top: -8px;
    font-size: 12px;
    color: #666;
    text-align: center;
}

.circle .icon,
.circle .picture {
    border-radius: 50%;
}

.circle .picture {
    overflow: hidden;
}

.circle .icon i::before {
    content: '\e6da';
    font-size: 30px;
}

.popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 20181211;
    background: rgb(0 0 0 / 70%);
}

.popup .button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 20;
    width: 100%;
    padding: 1rem;
    text-align: center;
    background: rgb(255 255 255 / 100%);
}

.popup button {
    -webkit-tap-highlight-color: transparent;
}

.clip-popup {
    background: none;
}

.clip-popup .clip-box,
.clip-popup .clip-move,
.clip-popup .popup-move {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

.clip-popup .popup-move {
    background: rgb(0 0 0 / 50%);
    z-index: 18;
}

.clip-popup .clip-box {
    z-index: 20;
}

.clip-popup .clip-view {
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
    outline: 1px solid rgb(50 135 255 / 100%);
}

.clip-popup .clip-move {
    background: rgb(255 255 255 / 10%);
    z-index: 21;
}

.clip-popup .clip-info {
    display: block;
    position: absolute;
    top: -26px;
    left: 12px;
    width: 112px;
    height: 25px;
    padding: 2px 5px;
    background: rgb(0 0 0 / 80%);
    color: #fff;
}

.clip-popup .clip-line {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    z-index: 25;
}

.clip-popup .line-t {
    top: -5px;
    height: 10px;
}

.clip-popup .line-r {
    top: 0;
    right: -5px;
    width: 10px;
}

.clip-popup .line-b {
    bottom: -5px;
    height: 10px;
}

.clip-popup .line-l {
    top: 0;
    left: -5px;
    width: 10px;
}

.clip-popup .clip-point {
    position: absolute;
    display: block;
    width: 16px;
    height: 16px;
    z-index: 26;
}

.clip-popup .point-tr {
    top: -3px;
    right: -3px;
    border-top: 3px solid rgb(50 135 255 / 100%);
    border-right: 3px solid rgb(50 135 255 / 100%);
}

.clip-popup .point-br {
    bottom: -3px;
    right: -3px;
    border-right: 3px solid rgb(50 135 255 / 100%);
    border-bottom: 3px solid rgb(50 135 255 / 100%);
}

.clip-popup .point-tl {
    top: -3px;
    left: -3px;
    border-top: 3px solid rgb(50 135 255 / 100%);
    border-left: 3px solid rgb(50 135 255 / 100%);
}

.clip-popup .point-bl {
    bottom: -3px;
    left: -3px;
    border-bottom: 3px solid rgb(50 135 255 / 100%);
    border-left: 3px solid rgb(50 135 255 / 100%);
}

.clip-popup .range {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 5rem;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 30;
    width: 50%;
    min-width: 25rem;
    height: 30px;
    padding: 0 50px;
}

.clip-popup .range input[type='range'] {
    -webkit-box-flex: 1;
    flex: 1;
    display: block;
    margin: 0 20px;
    height: 3px;
    border-radius: 2px;
    background: rgb(255 255 255 / 80%);
    appearance: none;
}

.clip-popup .range input[type='range']::-webkit-slider-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: none;
    box-shadow: 0 0 3px rgb(255 255 255 / 100%);
    background: rgb(50 135 255 / 100%);
    appearance: none;
}

.clip-popup .range span {
    color: #fff;
}

/* 弹框切换放大渐变 */
.opacity-enter-active,
.opacity-leave-active {
    transition: all 0.3s;
}

.opacity-enter,
.opacity-leave-to {
    opacity: 0;
}
</style>
