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
  InputAdornment,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PixIcon from "@mui/icons-material/Pix";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SearchIcon from "@mui/icons-material/Search";
import pixImg from "/assets/pix.jpeg";
function Home() {
  const [listGifts, setListGifts] = useState<Gift[]>([]);
  const [selectedGifts, setSelectedGifts] = useState<number[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState("");
  const [isLoadingGifts, setIsLoadingGifts] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [openPixDialog, setOpenPixDialog] = useState(false);
  const pixCode = "fea8ef48-fa5c-4ddd-a7ec-8cbd78a0161e";
  const [copied, setCopied] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

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

  const filteredGifts = listGifts.filter(
    (gift) =>
      gift.gift_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gift.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedGifts = filteredGifts.reduce<Record<string, Gift[]>>(
    (acc, gift) => {
      const { category } = gift;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(gift);
      return acc;
    },
    {}
  );

  if (isLoadingGifts) {
    return (
      <div className="loading-container">
        <CircularProgress size={60} />
        <Typography variant="h6">Carregando presentes...</Typography>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Backdrop className="loading-backdrop" open={isConfirming}>
        <div className="loading-backdrop-content">
          <CircularProgress color="inherit" size={60} />
          <Typography variant="h6">Confirmando presentes...</Typography>
        </div>
      </Backdrop>

      {/* Header moderno inspirado no Airbnb */}
      <div className="header-gradient">
        <Typography variant="h2" component="h1" className="header-title">
          Lista de Presentes 💝
        </Typography>
        <Typography variant="h5" className="header-subtitle">
          Escolha um presente especial para tornar nosso dia ainda mais especial
        </Typography>
      </div>

      {/* Campo de pesquisa */}
      <div className="search-container">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Pesquisar presentes por nome ou categoria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-field"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#717171" }} />
              </InputAdornment>
            ),
            className: "search-input",
          }}
          InputLabelProps={{
            className: "search-input-field",
          }}
        />
      </div>

      {/* Botão PIX estilo Airbnb */}
      <Fab
        color="default"
        aria-label="pix"
        onClick={handleOpenPixDialog}
        className="pix-button"
      >
        <PixIcon sx={{ fontSize: 28 }} />
      </Fab>

      {/* Grid de categorias estilo Airbnb */}
      <div className="categories-container">
        <div className="categories-grid">
          {Object.keys(groupedGifts)
            .sort((a, b) => groupedGifts[a].length - groupedGifts[b].length)
            .map((categoryName) => (
              <Card
                key={categoryName}
                sx={{
                  borderRadius: "16px",
                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)",
                  border: "1px solid #EBEBEB",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: "0 2px 16px rgba(0,0,0,0.12)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        background:
                          "linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "white",
                          fontSize: "20px",
                          fontWeight: 600,
                        }}
                      >
                        {categoryName.charAt(0).toUpperCase()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                          fontWeight: 600,
                          color: "#222222",
                          fontSize: "18px",
                          lineHeight: 1.2,
                        }}
                      >
                        {categoryName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#717171",
                          fontSize: "14px",
                        }}
                      >
                        {groupedGifts[categoryName].length}{" "}
                        {groupedGifts[categoryName].length === 1
                          ? "item"
                          : "itens"}
                      </Typography>
                    </Box>
                  </Box>

                  <List className="category-list">
                    {groupedGifts[categoryName].map((gift) => (
                      <ListItem
                        key={gift.id}
                        sx={{
                          px: 0,
                          py: 1,
                          borderRadius: "8px",
                          mb: 0.5,
                          opacity: gift.selected && gift.gift_giver ? 0.5 : 1,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: "#F7F7F7",
                          },
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography
                              sx={{
                                fontWeight:
                                  gift.selected && gift.gift_giver ? 400 : 500,
                                color:
                                  gift.selected && gift.gift_giver
                                    ? "#717171"
                                    : "#222222",
                                fontSize: "15px",
                                textDecoration:
                                  gift.selected && gift.gift_giver
                                    ? "line-through"
                                    : "none",
                              }}
                            >
                              {gift.gift_name}
                            </Typography>
                          }
                          secondary={
                            gift.selected &&
                            gift.gift_giver && (
                              <Typography
                                sx={{
                                  color: "#008A05",
                                  fontSize: "12px",
                                  fontWeight: 500,
                                  mt: 0.5,
                                }}
                              >
                                ✓ Já selecionado
                              </Typography>
                            )
                          }
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
                          sx={{
                            color: "#DDDDDD",
                            "&.Mui-checked": {
                              color: "#FF385C",
                            },
                            "&.Mui-disabled": {
                              color: "#008A05",
                            },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Botão de confirmação estilo Airbnb */}
      {selectedGifts.length > 0 && (
        <Fab
          variant="extended"
          aria-label="confirmar"
          onClick={handleOpenDialog}
          className="confirm-button"
        >
          <CheckCircleIcon sx={{ mr: 1, fontSize: 20 }} />
          Confirmar ({selectedGifts.length})
        </Fab>
      )}

      {/* Dialog PIX estilo Airbnb */}
      <Dialog
        open={openPixDialog}
        onClose={handleClosePixDialog}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            maxWidth: "400px",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontSize: "20px",
            fontWeight: 600,
            color: "#222222",
            pb: 1,
          }}
        >
          💰 Contribuição via PIX
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", px: 3, pb: 2 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: "12px",
              backgroundColor: "#F7F7F7",
              mb: 3,
            }}
          >
            <img
              src={pixImg}
              alt="QR Code Pix"
              style={{
                maxWidth: 280,
                width: "100%",
                borderRadius: "8px",
              }}
            />
          </Box>
          <Typography
            variant="body2"
            sx={{
              wordBreak: "break-all",
              mb: 3,
              color: "#717171",
              fontSize: "14px",
              fontFamily: "monospace",
              backgroundColor: "#F7F7F7",
              p: 2,
              borderRadius: "8px",
            }}
          >
            {pixCode}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyPix}
            fullWidth
            className="pix-copy-button"
          >
            {copied ? "✓ Copiado!" : "Copiar código PIX"}
          </Button>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button
            onClick={handleClosePixDialog}
            fullWidth
            className="dialog-button"
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmação estilo Airbnb */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullScreen={fullScreen}
        PaperProps={{
          sx: {
            borderRadius: fullScreen ? 0 : "16px",
            maxWidth: "500px",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "24px",
            fontWeight: 600,
            color: "#222222",
            textAlign: "center",
            pb: 2,
          }}
        >
          🎁 Confirmar Presentes
        </DialogTitle>

        <DialogContent sx={{ pb: 2 }}>
          <Typography
            variant="body1"
            sx={{
              color: "#717171",
              mb: 2,
              textAlign: "center",
            }}
          >
            Você está selecionando os seguintes presentes:
          </Typography>

          <Box
            sx={{
              backgroundColor: "#F7F7F7",
              borderRadius: "12px",
              p: 2,
              mb: 3,
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            {listGifts
              .filter((gift) => selectedGifts.includes(gift.id))
              .map((gift, index) => (
                <Box
                  key={gift.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    py: 1,
                    borderBottom:
                      index < selectedGifts.length - 1
                        ? "1px solid #EBEBEB"
                        : "none",
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      color: "#FF385C",
                      fontSize: 20,
                      mr: 2,
                    }}
                  />
                  <Typography
                    sx={{
                      color: "#222222",
                      fontWeight: 500,
                      fontSize: "15px",
                    }}
                  >
                    {gift.gift_name}
                  </Typography>
                </Box>
              ))}
          </Box>

          <TextField
            label="Seu nome completo"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isConfirming}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                fontSize: "16px",
              },
              "& .MuiInputLabel-root": {
                fontSize: "16px",
              },
            }}
          />
        </DialogContent>

        <Box sx={{ p: 2, textAlign: "center" }}>
          <img
            src="/assets/casamento.svg"
            alt="casamento"
            style={{
              maxWidth: "100%",
              height: "auto",
              maxHeight: fullScreen ? "120px" : "150px",
              objectFit: "contain",
              opacity: 0.8,
            }}
          />
        </Box>

        <DialogActions className="dialog-actions-large">
          <Button
            onClick={handleCloseDialog}
            disabled={isConfirming}
            fullWidth
            className="dialog-button-secondary"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!name.trim() || isConfirming}
            variant="contained"
            fullWidth
            startIcon={isConfirming ? <CircularProgress size={20} /> : null}
            className="dialog-button-primary"
          >
            {isConfirming ? "Confirmando..." : "Confirmar Presentes"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Home;
