import React from "react";
import GridLayout from "react-grid-layout";

function Test() {
    const layout = [
        { i: "a", x: 0, y: 0, w: 1, h: 2, static: true },
        { i: "b", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
        { i: "c", x: 4, y: 0, w: 1, h: 2 }
    ];
    return (
        <GridLayout className="layout" cols={12} rowHeight={30} width={1200}>
            <div key="a" data-grid={{ x: 0, y: 0, w: 1, h: 2}}>
                <div className="icon-box lor-ccss">
                    <p>
                        Lorem ipsum dolor sit amet, consectetuer adipiscing
                        elit, sed diam nonummy nibh euismod tincidunt ut
                        laoreet dolore magna aliquam erat volutpat. Ut wisi
                        enim ad minim veniam, quis nostrud exerci tation
                        ullamcorper suscipit lobortis nisl ut aliquip ex ea
                        commodo consequat. Duis autem vel eum iriure dolor in{" "}
                    </p>
                    <h5>-an Expert</h5>
                </div>
            </div>
            <div key="b" data-grid={{ x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 }}>
            <div className="icon-box lor-ccss">
                    <p>
                        Lorem ipsum dolor sit amet, consectetuer adipiscing
                        elit, sed diam nonummy nibh euismod tincidunt ut
                        laoreet dolore magna aliquam erat volutpat. Ut wisi
                        enim ad minim veniam, quis nostrud exerci tation
                        ullamcorper suscipit lobortis nisl ut aliquip ex ea
                        commodo consequat. Duis autem vel eum iriure dolor in{" "}
                    </p>
                    <h5>-an Expert</h5>
                </div>
            </div>
            <div key="c" data-grid={{ x: 4, y: 0, w: 1, h: 2 }}>
            <div className="icon-box lor-ccss">
                    <p>
                        Lorem ipsum dolor sit amet, consectetuer adipiscing
                        elit, sed diam nonummy nibh euismod tincidunt ut
                        laoreet dolore magna aliquam erat volutpat. Ut wisi
                        enim ad minim veniam, quis nostrud exerci tation
                        ullamcorper suscipit lobortis nisl ut aliquip ex ea
                        commodo consequat. Duis autem vel eum iriure dolor in{" "}
                    </p>
                    <h5>-an Expert</h5>
                </div>
            </div>
        </GridLayout>
    );

}
export default Test;