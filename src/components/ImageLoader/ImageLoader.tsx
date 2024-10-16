import { Flex, Loader, Image } from "@mantine/core";
import { ReactElement } from "react";
  
 export const ImageLoader = (props: {url: string | null, loading: boolean, setLoading: (value: boolean) => void}): ReactElement => {
    return (
      <Flex
        mih="100%"
        gap="md"
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
      >
          <div style={{ display: props.loading ? 'block' : 'none' }}>
            <Loader />
          </div>
          <div style={{ display: props.loading ? 'none' : 'block' }}>
            <Image src={props.url} onLoad={() => props.setLoading(false)} />
          </div>
      </Flex>
    )
  };