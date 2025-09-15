import React, { useEffect, useState } from "react";
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
  Grid,
  CardContent,
  Typography,
  Fab, // Importado o componente Fab
  Box, // Importado para ajudar no posicionamento
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function Home() {
  const [listGifts, setListGifts] = useState<Gift[]>([]);
  const [selectedGifts, setSelectedGifts] = useState<number[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState("");

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

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

  const groupedGifts = listGifts.reduce((acc, gift) => {
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
        <h3>Selecione o presente que deseja nos presentear</h3>
      </div>

      <Grid container spacing={3} sx={{ p: 2 }}>
        {Object.keys(groupedGifts).map((categoryName) => (
          <Grid item xs={12} sm={6} key={categoryName}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                  {categoryName}
                </Typography>
                <List>
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
                        disabled={gift.selected && gift.gift_giver}
                        edge="end"
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Oculta o botão flutuante se a seleção estiver vazia */}
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
          <CheckCircleIcon sx={{ mr: 1 }} />
          Confirmar
        </Fab>
      )}

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
        <DialogActions>
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
