# LabelPair
![banner](imgs/banner.gif)

A booru-style tagging tool in browser, which used for training stable diffusion lora, etc.

Try here: [https://icesandwich.github.io/LabelPair/](https://icesandwich.github.io/LabelPair/)

**All files will process in your local browser.**

# Usage
## Prepare dataset

   Use your favorite tagging model or method to tag your images automatically first. Personally i use [this](https://github.com/hollowstrawberry/kohya-colab/blob/main/Dataset_Maker.ipynb) which base on [kohya_sdscript](https://github.com/kohya-ss/sd-scripts/blob/main/finetune/make_captions.py).

   No matter what method you use, your dataset should look like this:
   ```
   dataset
       1.png
       1.txt
       2.png
       2.txt
       ...
   ```

​	The txt contains tags of the image with the same filename, its content looks like this:

```txt
solo, looking at viewer, open mouth, sitting, outdoors, collar, chair, cat, orange fur, male focus, cat, cute, blush, full body, smile, :3, sunlight
```

## Upload dataset

Open [Demo Link](https://icesandwich.github.io/LabelPair/) and drag images and texts(*.txt) **together** to specific area of the page.

All files process in your local browser, don't worry. I don't have money to buy a server.

## Happy tagging

In **MultiSelect** mode, you can select some images to add/remove/rename tag. If you don't select any images, will use all images by default.

**Retrieve** can retrieve images that doesn't contain this tag. Useful to balance you tags.

**Analysis** shows your tags distribution.

## Save your world

Click `Export` at the top. This will only save txt files. You may consider override source tag files or use diff compare tool to double check.

# Build

This project doesn't use webpack so it's unnecessary to build.
