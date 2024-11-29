import { useContext, useEffect, useState } from 'react';
import { Container, Group } from '@mantine/core';
import classes from './MainAppFooter.module.css';
import { FooterContext } from '@/context/footer-context';

export function MainAppFooter() {

  const { element } = useContext(FooterContext);

  const [renderElement, setRenderElement] = useState<JSX.Element>(<></>);
  useEffect(() => {
    setRenderElement(element);
  }, [element]);

  return (
      <Container fluid className={classes.inner}>
          {renderElement.props.children}
      </Container>
  );
}