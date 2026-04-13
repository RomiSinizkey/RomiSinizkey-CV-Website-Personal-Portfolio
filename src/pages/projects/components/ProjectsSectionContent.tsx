import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { animationPresets } from "@/design-system/motion/presets";
import { Container, Section, Stack, Grid, Card } from "@/design-system/layout/primitives";
import { Button, Badge, Label, Divider } from "@/design-system/ui/primitives";
import { profile } from "@/data/profile";

interface ProjectsSectionContentProps {
  embedded?: boolean;
}

export function ProjectsSectionContent({ embedded = false }: ProjectsSectionContentProps) {
  return (
    <div className="relative min-h-screen">
      {embedded ? (
        <>
          <div id="projects-preview" className="h-px w-px" aria-hidden="true" />
          <div className="mx-auto w-full max-w-5xl">
            <h2 className="homepage-section-title">Projects</h2>
            <p className="mt-3 text-slate-600">A single-page flow: scroll to move between sections.</p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {profile.projects.map((project) => (
                <a
                  key={project.name}
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="homepage-glass-card transition hover:-translate-y-1"
                >
                  <h3 className="text-xl font-bold text-slate-900">{project.name}</h3>
                  <p className="mt-2 text-sm text-slate-600">{project.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span key={`${project.name}-${tech}`} className="homepage-pill-dark">
                        {tech}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <Section py={12}>
            <Container maxWidth="lg">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex items-center justify-between"
              >
                <h1 className="text-4xl font-bold">Projects</h1>
                <Link to="/" className="font-medium text-orange-600 transition hover:text-orange-700">
                  ← Back Home
                </Link>
              </motion.div>
            </Container>
          </Section>

          <Section py={12}>
            <Container maxWidth="lg">
              <Grid cols={2} gap={6} className="lg:grid-cols-1 2xl:grid-cols-2">
                {profile.projects.map((project, idx) => (
                  <motion.div
                    key={project.name}
                    variants={animationPresets.fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    transition={{ delay: idx * 0.15 }}
                    viewport={{ once: true }}
                  >
                    <Card interactive className="h-full">
                      <Stack direction="col" gap={4} align="start">
                        <h3 className="text-xl font-bold">{project.name}</h3>
                        <p className="text-sm text-gray-600">{project.desc}</p>

                        <Divider />

                        <div className="w-full">
                          <Label className="mb-2 text-orange-600">Tech Stack</Label>
                          <Stack direction="row" gap={2} wrap align="start">
                            {project.tech.map((tech) => (
                              <Badge key={tech} variant="primary" size="sm">
                                {tech}
                              </Badge>
                            ))}
                          </Stack>
                        </div>

                        <Button
                          variant="primary"
                          size="md"
                          onClick={() => window.open(project.link, "_blank")}
                          className="mt-2 w-full"
                        >
                          View on GitHub →
                        </Button>
                      </Stack>
                    </Card>
                  </motion.div>
                ))}
              </Grid>
            </Container>
          </Section>
        </>
      )}

    </div>
  );
}
