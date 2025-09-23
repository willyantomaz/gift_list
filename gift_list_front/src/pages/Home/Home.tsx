import { useEffect, useState } from "react";
import "./Home.css";
import api from "../../services/api";
import type { Gift } from "../../entity/gift";
import Checkbox from "@mui/material/Checkbox";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Card,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  CardContent,
  Typography,
  Fab,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import QrCodeIcon from "@mui/icons-material/QrCode";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import pixImg from "/public/assets/pix.jpeg";
function Home() {
  const [listGifts, setListGifts] = useState<Gift[]>([]);
  const [selectedGifts, setSelectedGifts] = useState<number[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState("");

  // Pix Dialog states
  const [openPixDialog, setOpenPixDialog] = useState(false);
  const pixCode = "fea8ef48-fa5c-4ddd-a7ec-8cbd78a0161e";
  const [copied, setCopied] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  async function getGifts() {
    const response = await api.get("/gifts");
    setListGifts(response.data);
  }

  useEffect(() => {
    getGifts();
  }, []);

  const handleToggle = (id: number) => {
    setSelectedGifts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((giftId) => giftId !== id)
        : [...prevSelected, id]
    );
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Pix Dialog handlers
  const handleOpenPixDialog = () => {
    setOpenPixDialog(true);
    setCopied(false);
  };
  const handleClosePixDialog = () => {
    setOpenPixDialog(false);
  };
  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirm = async () => {
    await api.put("/gifts/select", {
      name,
      gifts: selectedGifts,
    });

    setOpenDialog(false);
    setSelectedGifts([]);
    setName("");
    getGifts();
  };

  const groupedGifts = listGifts.reduce<Record<string, Gift[]>>((acc, gift) => {
    const { category } = gift;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(gift);
    return acc;
  }, {});

  return (
    <>
      <div className="container">
        <h1>Lista de Presentes</h1>
        <h3>Selecione um item que deseja nos presentear</h3>
      </div>

      <Fab
        color="secondary"
        aria-label="pix"
        onClick={handleOpenPixDialog}
        sx={{
          position: "fixed",
          bottom: theme.spacing(4),
          left: theme.spacing(4),
          zIndex: 1201,
          scale: 1.3,
        }}
      >
        <QrCodeIcon sx={{ scale: 1.2 }} />
      </Fab>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 3,
          p: 2,
        }}
      >
        {Object.keys(groupedGifts)
          .sort((a, b) => groupedGifts[a].length - groupedGifts[b].length)
          .map((categoryName) => (
            <Box key={categoryName}>
              <Card sx={{ width: "100%" }}>
                <CardContent>
                  <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                    {categoryName}
                  </Typography>
                  <List
                    sx={{
                      maxHeight: (isDesktop ? 10 : 5) * 56,
                      overflowY: "auto",
                      overflowX: "hidden",
                    }}
                  >
                    {groupedGifts[categoryName].map((gift) => (
                      <ListItem
                        key={gift.id}
                        disablePadding
                        sx={{
                          opacity: gift.selected && gift.gift_giver ? 0.5 : 1,
                        }}
                      >
                        <ListItemText
                          primary={gift.gift_name}
                          secondary={`Categoria: ${gift.category}`}
                          sx={{
                            textDecoration:
                              gift.selected && gift.gift_giver
                                ? "line-through"
                                : "none",
                          }}
                        />
                        <Checkbox
                          checked={
                            gift.selected && gift.gift_giver
                              ? true
                              : selectedGifts.includes(gift.id)
                          }
                          onChange={() => handleToggle(gift.id)}
                          disabled={!!(gift.selected && gift.gift_giver)}
                          edge="end"
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Box>
          ))}
      </Box>

      {selectedGifts.length > 0 && (
        <Fab
          variant="extended"
          color="primary"
          aria-label="confirmar"
          onClick={handleOpenDialog}
          sx={{
            position: "fixed",
            bottom: theme.spacing(4),
            right: theme.spacing(4),
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          <CheckCircleIcon sx={{ mr: 2 }} />
          Confirmar
        </Fab>
      )}

      {/* Dialog do Pix */}
      <Dialog open={openPixDialog} onClose={handleClosePixDialog}>
        <DialogTitle>Faça um Pix </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <img
            src={pixImg}
            alt="QR Code Pix"
            style={{ maxWidth: 300, width: "100%", marginBottom: 16 }}
          />
          <Typography variant="body1" sx={{ wordBreak: "break-all", mb: 2 }}>
            {pixCode}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyPix}
            sx={{ mb: 1 }}
          >
            {copied ? "Copiado!" : "Copiar código Pix"}
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePixDialog}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullScreen={fullScreen}
      >
        <DialogTitle>Confirmar Presente</DialogTitle>
        <DialogContent>
          <p>Você está confirmando os seguintes presentes:</p>
          <List>
            {listGifts
              .filter((gift) => selectedGifts.includes(gift.id))
              .map((gift) => (
                <ListItem key={gift.id}>
                  <ListItemText primary={gift.gift_name} />
                </ListItem>
              ))}
          </List>

          <TextField
            margin="dense"
            label="Seu Nome"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <img
          src="/public/assets/casamento.svg"
          alt="Celebration"
          width="100%"
        />

        <DialogActions
          style={{ justifyContent: "space-around", padding: "16px" }}
        >
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleConfirm}
            disabled={!name.trim()}
            variant="contained"
            color="primary"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Home;
