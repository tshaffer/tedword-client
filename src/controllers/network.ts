export const uploadFile = (file: File) => {
  return (dispatch: any) => {
    console.log('uploadFile');
    console.log(file);
    fetch('http://localhost:5000/api/v1/uploadPuzzle', {
      // content-type header should not be specified!
      method: 'POST',
      body: file,
    })
      .then(response => response.json())
      .then(success => {
        // Do something with the successful response
        console.log(success);
      })
      .catch(error => console.log(error)
      );
  };
};

