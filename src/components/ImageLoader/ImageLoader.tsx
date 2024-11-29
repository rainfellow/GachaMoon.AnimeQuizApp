import { Flex, Loader, Image } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { ReactElement, useEffect } from "react";
  
 export const ImageLoader = (props: {url: string | null, loading: boolean, isBonusTime: boolean, setLoading: (value: boolean) => void}): ReactElement => {
    const { height, width } = useViewportSize();

    const calcImageWidth = (viewPortWidth: number) => {
      return Math.min(1280, Math.max(640, viewPortWidth / 2.5));
    }
    const calcImageHeight = (viewPortWidth: number) => {
      return Math.min(720, Math.max(360, viewPortWidth * 9 / (2.5 * 16)));
    }


    return (
      <Flex
        w={calcImageWidth(width)} h={calcImageHeight(width)}
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
      >
          <div style={{ width: calcImageWidth(width), height: calcImageHeight(width), alignItems: 'center', justifyContent: 'center', display: props.loading ? 'block' : 'none' }}>
            <Loader />
          </div>
          <div style={{ width: calcImageWidth(width), height: calcImageHeight(width), display: props.loading ? 'none' : 'block' }}>
            {props.isBonusTime ? <></>
              : <Image w={calcImageWidth(width)} h={calcImageHeight(width)} src={props.url} onLoad={() => props.setLoading(false)} /> }
          </div>
      </Flex>
    )
  };