# Notes

## Role `log` vs. `status`

Regardless of their DOM position, `log` will always spoken before `status`. If `status` is currently speaking, a change to `log` will interrupt `status`.

## Carefully using React key

When React key changed but the element kept the same, React will recreate the element.

If the element live inside a "live" region, it will be narrated twice because the element is being recreated.
