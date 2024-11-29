import { MultiplayerGameContext } from "@/context/multiplayer-game-context"
import { useMultiplayerGame } from "@/hooks/use-multiplayer-game";
import { ReactElement, useContext, useEffect, useRef, useState } from "react";
import cards from '../../static/cards.png'
import { StandoffCard } from "@/models/GameConfiguration";

export const MultiplayerGameStandoffDeckGame: React.FC = (): ReactElement => {

    const { deckState } = useContext(MultiplayerGameContext);
    const { drawCard, discardCard } = useMultiplayerGame();
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    const width = 800;
    const height = 500;
    const options = {
        backgroundColor: 0x56789a,
        resolution: window.devicePixelRatio,
        width: width,
        height: height
      };
    
    const [isDiscarding, setIsDiscarding] = useState(false);
    const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);

    const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      canvasElements.forEach(element => {
        if (element.visible)
        {
          element.draw(ctx);
        }
      });
    }

    function getMousePos(canvas: HTMLCanvasElement, event: MouseEvent) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }
    
    useEffect(() => {
      if (canvasRef.current != undefined)
      {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (context != null)
        {
          let frameCount = 0;
          let animationFrameId: number;
          
          //Our draw came here
          const render = () => {
            frameCount++
            draw(context, frameCount)
            animationFrameId = window.requestAnimationFrame(render)
          }
          render()
          
          return () => {
            window.cancelAnimationFrame(animationFrameId)
          }
        }
      }
    }, [draw])

    useEffect(() => {
      let drawCardButton = new CanvasButton("draw_btn", 0, DOMRect.fromRect({ x: 100, y: 20, width: 100, height: 30 }), () => drawCard(), undefined, "");
      let discardCardButton = new CanvasButton("disc_btn", 0, DOMRect.fromRect({ x: 100, y: 70, width: 100, height: 30 }), () => setIsDiscarding(true), undefined, "");
      let cardContainer = new CanvasHorizontalContainer("card_cntnr", 0, DOMRect.fromRect({ x: 100, y: 400, width: 100, height: 30 }), () => setIsDiscarding(true), undefined);

      deckState.playerDeck.forEach((card) => cardContainer.addElement(new CanvasCard(card.id, 0, 0, 0, undefined, undefined, card)));

      setCanvasElements([drawCardButton, discardCardButton, cardContainer]);
    }, []);
    
    return <canvas ref={canvasRef} width={options.width} height={options.height}/>
}

abstract class CanvasElement {
  z_index: number;
  rect: DOMRect;
  visible: boolean;
  active: boolean;
  id: string;
  onClick: (() => void) | undefined 
  onHover: (() => void) | undefined 

  constructor(id: string, z: number, rect: DOMRect, onClick: (() => void) | undefined, onHover: (() => void) | undefined) {
    this.z_index = z;
    this.rect = rect;
    this.onClick = onClick;
    this.onHover = onHover;
    this.visible = true;
    this.active = true;
    this.id = id;
  }

  setVisible(isVisible: boolean): void {
    this.visible = isVisible;
  }

  setActive(isActive: boolean): void {
    this.active = isActive;
  }

  abstract draw(context: CanvasRenderingContext2D): void
}

class CanvasButton extends CanvasElement {
  text: string | undefined;
  constructor(id: string, z: number, rect: DOMRect, onClick: () => void, onHover: (() => void) | undefined, text: string | undefined) { 
    super(id, z, rect, onClick, onHover);
    this.text = text;
  }

  draw(context: CanvasRenderingContext2D): void {
    let rect = this.rect;
    let text = this.text;
    context.rect(rect.x, rect.y, rect.width, rect.height);
    context.fillStyle = 'rgba(225,225,225,0.5)';
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = '#000000';
    context.stroke();
    context.closePath();
    if (text != undefined)
    {
      context.font = '40pt Kremlin Pro Web';
      context.fillStyle = '#000000';
      context.fillText(text, rect.x + rect.width / 4, rect.y + 64);
    }
  }
}

class CanvasCard extends CanvasElement {
  card: StandoffCard;
  constructor(id: string, z: number, x: number, y: number, onClick: (() => void) | undefined, onHover: (() => void) | undefined, card: StandoffCard) { 
    super(id, z, DOMRect.fromRect({ x: x, y: y, width: 100, height: 200 }), onClick, onHover);
    this.card = card;
  }

  draw(context: CanvasRenderingContext2D): void {
    throw new Error("Method not implemented.");
  }
}

class CanvasHorizontalContainer extends CanvasElement {
  elements: CanvasElement[] = [];

  constructor(id: string, z: number, rect: DOMRect, onClick: (() => void) | undefined, onHover: (() => void) | undefined) { 
    super(id, z, rect, onClick, onHover);
  }
  addElement(element: CanvasElement): void {
    let isFirst = this.elements.length == 0;
    let rect = !isFirst ? this.elements[this.elements.length - 1].rect : DOMRect.fromRect({ x: 0, y: 0, width: element.rect.width, height: element.rect.height });
    let newRect = isFirst ? rect : DOMRect.fromRect({ x: rect.x + rect.width + 20, y: rect.y, width: element.rect.width, height: element.rect.height });
    element.rect = newRect;
    this.elements.push(element);
  }

  deleteElement(id: string): boolean {
    let element = this.elements.find((x) => x.id == id);
    if (element == undefined)
    {
      return false;
    }
    else
    {
      this.elements = this.elements.filter((x) => x.id != id);
      return true;
    }
  }

  draw(context: CanvasRenderingContext2D): void {
    let rect = this.rect;
    context.rect(rect.x, rect.y, rect.width, rect.height);
    this.elements.forEach((element) => element.draw(context));
  }
  
}
