export function accordion(node, isOpen) {
    let initialHeight = node.offsetHeight;
    node.style.height = isOpen ? 'auto' : 0;
    node.style.overflow = "hidden";
    let animation = node.animate(
        [
            {
                height: initialHeight + 'px',
                overflow: 'hidden'
            },
            {
                height: 0,
                overflow: 'hidden'
            }
        ],
        {duration: 100, fill: 'both'}
    );
    return {
        update(isOpen) {
            animation.pause();
            if (!isOpen) {
                animation.play();
            } else {
                animation.reverse();
            }
        }
    };
}