export const rules = {
  image: {
    quality: 85,
    minWidth: 640,
    minHeight: 480,
    maxWidth: 1080,
    maxHeight: 1080
  }
}


async function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      resolve(img);
    };

    img.onerror = (error) => {
      reject(error);
    };

    img.src = source;
  });
}

export async function cropImageCenter(source: string, width: number, height: number, quality: number = rules.image.quality): Promise<string> {
  const canvas = document.createElement("canvas");

  let image: HTMLImageElement | undefined;

  try {
    image = await loadImage(source);

    const {naturalWidth: sourceWidth, naturalHeight: sourceHeight} = image;

    const sourceRatio = sourceWidth / sourceHeight;
    const targetRatio = width / height;

    let targetWidth = sourceWidth;
    let targetHeight = sourceHeight;
    if (sourceRatio > targetRatio) {
      targetWidth = sourceHeight * targetRatio;
    } else if (sourceRatio < targetRatio) {
      targetHeight = sourceWidth / targetRatio;
    }

    if (targetWidth < rules.image.minWidth || targetHeight < rules.image.minHeight) {
      return source;
    }

    const sx = (sourceWidth - targetWidth) / 2;
    const sy = (sourceHeight - targetHeight) / 2;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Não foi possível criar o contexto para processar a imagem.");
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.drawImage(image, sx, sy, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", quality / 100);
  } catch (error) {
    console.warn("Erro ao processar imagem. Será usada a imagem de origem.", error)

    return source;
  } finally {
    image?.remove();
    canvas.remove();
  }
}

export async function resizeImage(source: string, maxWidth: number = rules.image.maxWidth, maxHeight: number = rules.image.maxHeight, quality: number = rules.image.quality): Promise<string> {
  const canvas = document.createElement("canvas");

  let image: HTMLImageElement | undefined;

  try {
    image = await loadImage(source);

    const {naturalWidth: sourceWidth, naturalHeight: sourceHeight} = image;

    const dx = sourceWidth - maxWidth;
    const dy = sourceHeight - maxHeight;

    if (dx < 0 && dy < 0) {
      return source;
    }

    const sourceRatio = sourceWidth / sourceHeight;

    let targetWidth = maxWidth;
    let targetHeight = maxHeight;
    if (dx > dy) {
      targetHeight = maxWidth / sourceRatio;
    } else if (dx < dy) {
      targetWidth = maxHeight * sourceRatio;
    }

    if (targetWidth < rules.image.minWidth || targetHeight < rules.image.minHeight) {
      return source;
    }

    const canvas = document.createElement("canvas");

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Não foi possível criar o contexto para processar a imagem.");
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Preenche o fundo de branco (importante para imagens com transparência, como PNGs e SVGs)
    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenha a imagem por cima do fundo branco
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", quality / 100);
  } catch (error) {
    console.warn("Erro ao processar imagem. Será usada a imagem de origem.", error)

    return source;
  } finally {
    image?.remove();
    canvas.remove();
  }
}
