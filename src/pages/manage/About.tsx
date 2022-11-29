import { createResource } from "solid-js"
import { Markdown, MaybeLoading } from "~/components"

const fetchReadme = async () =>
  await (
    await fetch("https://jsd.nn.ci/gh/alist-org/alist@main/README.md")
  ).text()

const About = () => {
  const [readme] = createResource(fetchReadme)
  return (
    <MaybeLoading loading={readme.loading}>
      <Markdown children={readme()} />
    </MaybeLoading>
  )
}

export default About
