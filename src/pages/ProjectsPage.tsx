import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Container,
  Section,
  Stack,
  Grid,
  Card,
  Button,
  Badge,
  Label,
  Divider,
  animationPresets,
} from "../design-system";

export default function ProjectsPage() {
  const projects = [
    {
      name: "Smart Order Dashboard",
      desc: "A React+TS dashboard for order management with clean UI and API integration.",
      tech: ["React", "TypeScript", "Vite"],
      link: "https://github.com/RomiSinizkey/smart-order-dashboard",
    },
    {
      name: "Web Programming Chatroom",
      desc: "A web chatroom project with Node.js backend and MariaDB database.",
      tech: ["Node.js", "Express", "EJS", "MariaDB"],
      link: "https://github.com/RomiSinizkey/web-programming-chatroom",
    },
  ];

  return (
    <>
      {/* Header */}
      <Section py={12}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <h1 className="text-4xl font-bold">Projects</h1>
            <Link
              to="/"
              className="text-orange-600 hover:text-orange-700 transition font-medium"
            >
              ← Back Home
            </Link>
          </motion.div>
        </Container>
      </Section>

      {/* Projects Grid */}
      <Section py={12}>
        <Container maxWidth="lg">
          <Grid cols={2} gap={6} className="lg:grid-cols-1 2xl:grid-cols-2">
            {projects.map((project, idx) => (
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
                    <p className="text-gray-600 text-sm">{project.desc}</p>

                    <Divider />

                    <div className="w-full">
                      <Label className="text-orange-600 mb-2">Tech Stack</Label>
                      <Stack direction="row" gap={2} wrap align="start">
                        {project.tech.map((t) => (
                          <Badge key={t} variant="primary" size="sm">
                            {t}
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
  );
}
