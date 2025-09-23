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
  CircularProgress,
  Backdrop,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PixIcon from "@mui/icons-material/Pix";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import pixImg from "/assets/pix.jpeg";
function Home() {
  const [listGifts, setListGifts] = useState<Gift[]>([]);
  const [selectedGifts, setSelectedGifts] = useState<number[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState("");
  const [isLoadingGifts, setIsLoadingGifts] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);

  const [openPixDialog, setOpenPixDialog] = useState(false);
  const pixCode = "fea8ef48-fa5c-4ddd-a7ec-8cbd78a0161e";
  const [copied, setCopied] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  async function getGifts() {
    try {
      setIsLoadingGifts(true);
      const response = await api.get("/gifts");
      setListGifts(response.data);
    } catch (error) {
      console.error("Error fetching gifts:", error);
    } finally {
      setIsLoadingGifts(false);
    }
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
    try {
      setIsConfirming(true);
      await api.put("/gifts/select", {
        name,
        gifts: selectedGifts,
      });

      setOpenDialog(false);
      setSelectedGifts([]);
      setName("");
      getGifts();
    } catch (error) {
      console.error("Erro ao confirmar presentes:", error);
    } finally {
      setIsConfirming(false);
    }
  };

  const groupedGifts = listGifts.reduce<Record<string, Gift[]>>((acc, gift) => {
    const { category } = gift;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(gift);
    return acc;
  }, {});

  // Loading inicial dos presentes
  if (isLoadingGifts) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6">Carregando presentes...</Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Loading backdrop para confirmação */}
      <Backdrop
        sx={{ color: "#fff", zIndex: theme.zIndex.modal + 1 }}
        open={isConfirming}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress color="inherit" size={60} />
          <Typography variant="h6">Confirmando presentes...</Typography>
        </Box>
      </Backdrop>

      <div className="container">
        <h1>Lista de Presentes</h1>
        <h3>Selecione um item que deseja nos presentear</h3>
      </div>

      <Fab
        color="default"
        aria-label="pix"
        onClick={handleOpenPixDialog}
        sx={{
          position: "fixed",
          bottom: theme.spacing(4),
          left: theme.spacing(4),
          zIndex: 1201,
          scale: 1.3,
          backgroundColor: "#40CDF7",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#2bb7e6",
          },
        }}
      >
        <PixIcon sx={{ scale: 1.2 }} />
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
            disabled={isConfirming}
          />
        </DialogContent>
        <Box sx={{ p: 2, textAlign: "center" }}>
          <img
            src="/assets/casamento.svg"
            alt="casamento"
            style={{
              maxWidth: "100%",
              height: "auto",
              maxHeight: fullScreen ? "150px" : "200px",
              objectFit: "contain",
            }}
          />
        </Box>

        <DialogActions
          style={{ justifyContent: "space-around", padding: "16px" }}
        >
          <Button onClick={handleCloseDialog} disabled={isConfirming}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!name.trim() || isConfirming}
            variant="contained"
            color="primary"
            startIcon={isConfirming ? <CircularProgress size={20} /> : null}
          >
            {isConfirming ? "Confirmando..." : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Home;
