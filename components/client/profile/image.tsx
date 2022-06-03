import Image from "next/image";
import { SyntheticEvent, useCallback, useState } from "react";
import ReacrCrop, {centerCrop, Crop, makeAspectCrop } from "react-image-crop";

import styles from "../../../styles/page-styles/profile.module.css";

import 'react-image-crop/dist/ReactCrop.css';
import cropImage from "../../../utils/crop-image";
import { Loader } from "../../reusable/loader";

export default function ProfilePageImage({image, owned, updateImage}: Props) {

    const [newImage, setNewImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [crop, setCrop] = useState<Crop>({
        unit: "%",
        x: 50,
        y: 50,
        width: 50,
        height: 50,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setNewImage(URL.createObjectURL(file));
    }

    const handleImageLoad = useCallback((e: SyntheticEvent<HTMLImageElement>) => {
        const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
        const longer = width < height ? {width: 100} : {height: 100};
        const crop = centerCrop(
            makeAspectCrop(
                {
                  unit: '%',
                  ...longer
                },
                1,
                width,
                height
              ),
            width,
            height
          )          
        setCrop(crop);
    }, []);

    const handleChangeImage = useCallback(async () => {
        setLoading(true);
        setError("");
        cropImage({src: newImage, ...crop})
        .then(croppedImage => {
            fetch("/api/change/image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    base64Image: croppedImage
                })
            }).then(res => {
                if (res.ok) {
                    if (owned) updateImage(croppedImage);
                    setNewImage("");
                } else res.json().then(err => setError(err.message));
            }).catch(err => { setError(err) })
            .finally(() => { setLoading(false) })
        })
        .catch(err => {setError(err);})
        .finally(() => { setLoading(false) })
    }, [newImage, crop, owned, updateImage]);

    return <div className={styles['profile-page-image']}>
        <div className={styles['profile-page-image-circle']}>
            <Image src={image} alt="avatar" width={484} height={484} />
            {owned && <label htmlFor="profile-picture-input">
                <input type="file" accept="image/*" 
                id="profile-picture-input" onChange={handleChange} />
                <span>Change image</span>
            </label>}
        </div>
        {
            newImage && <div className={styles['profile-page-image-change'] + " modal-outer"}>
                <div>
                    <section className="flex justify-center">
                        <ReacrCrop crop={crop} 
                        onChange={(c, pc) => {setCrop(pc)}}
                        aspect={1}>
                            {/* eslint-disable-next-line @next/next/no-img-element*/}
                            <img src={newImage} alt="uploaded image"
                             onLoad={handleImageLoad}
                             className="!max-h-[65vh]"/>
                        </ReacrCrop>
                    </section>
                    <p className="text-red-600 mb-6">{error}</p>
                    {loading ? <Loader className="!text-green-600 !mx-auto" /> :
                    <div>
                        <button onClick={handleChangeImage} 
                        className="!bg-green-600 !text-white">Upload</button>
                        <button onClick={() => setNewImage("")}>Cancel</button>
                    </div>
                    }
                </div>
            </div>
        }
    </div>

}

type Props = {
    image: string;
    owned: false;
    updateImage?: undefined;
} | {
    image: string;
    owned: true;
    updateImage: (image: string) => void;
}